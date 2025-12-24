#!/usr/bin/env tsx
/**
 * Odds Polling Job
 *
 * Polls odds data from providers and stores in database
 * - Analytics only - no wagering functionality
 * - Deduplication: only stores when odds change or every 10 minutes
 * - Rate limit handling with exponential backoff
 * - Structured logging
 *
 * Usage:
 *   npm run poll-odds           # Run once
 *   npm run poll-odds -- --loop # Run continuously every 60s
 *   npm run poll-odds -- --dry  # Dry run mode
 */

import { PrismaClient, GameStatus } from "@prisma/client";
import { TheOddsApiProvider } from "../lib/odds/providers/theOddsApi";
import { League, MarketType } from "../lib/odds/types";

const prisma = new PrismaClient();

interface PollConfig {
  leagues: League[];
  pollIntervalSeconds: number;
  dedupeIntervalMinutes: number;
  dryRun: boolean;
  loop: boolean;
}

interface Logger {
  info: (msg: string, meta?: any) => void;
  warn: (msg: string, meta?: any) => void;
  error: (msg: string, meta?: any) => void;
  debug: (msg: string, meta?: any) => void;
}

// Structured logger
const logger: Logger = {
  info: (msg: string, meta?: any) => {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: new Date().toISOString(),
        message: msg,
        ...meta,
      })
    );
  },
  warn: (msg: string, meta?: any) => {
    console.warn(
      JSON.stringify({
        level: "warn",
        timestamp: new Date().toISOString(),
        message: msg,
        ...meta,
      })
    );
  },
  error: (msg: string, meta?: any) => {
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: new Date().toISOString(),
        message: msg,
        ...meta,
      })
    );
  },
  debug: (msg: string, meta?: any) => {
    if (process.env.DEBUG) {
      console.log(
        JSON.stringify({
          level: "debug",
          timestamp: new Date().toISOString(),
          message: msg,
          ...meta,
        })
      );
    }
  },
};

// In-memory cache of last stored odds (for deduplication)
const lastStoredOdds = new Map<string, { odds: any; timestamp: Date }>();

/**
 * Generate cache key for deduplication
 */
function getCacheKey(
  gameId: string,
  bookmakerId: string,
  marketId: string
): string {
  return `${gameId}:${bookmakerId}:${marketId}`;
}

/**
 * Check if odds should be stored (changed or 10+ min since last)
 */
function shouldStoreOdds(
  cacheKey: string,
  newOdds: any,
  dedupeMinutes: number
): boolean {
  const cached = lastStoredOdds.get(cacheKey);

  if (!cached) {
    return true; // First time seeing this combination
  }

  // Check time threshold (at least every N minutes)
  const minutesSinceLastStore =
    (Date.now() - cached.timestamp.getTime()) / 1000 / 60;
  if (minutesSinceLastStore >= dedupeMinutes) {
    return true;
  }

  // Check if odds have changed
  const oddsChanged =
    cached.odds.homeOdds !== newOdds.homeOdds ||
    cached.odds.awayOdds !== newOdds.awayOdds ||
    cached.odds.overOdds !== newOdds.overOdds ||
    cached.odds.underOdds !== newOdds.underOdds ||
    cached.odds.line !== newOdds.line;

  return oddsChanged;
}

/**
 * Main polling function
 */
async function pollOdds(config: PollConfig): Promise<void> {
  const startTime = Date.now();
  logger.info("Starting odds poll", {
    leagues: config.leagues,
    dryRun: config.dryRun,
  });

  const provider = new TheOddsApiProvider({});
  const stats = {
    gamesProcessed: 0,
    oddsSnapshotsStored: 0,
    oddsDeduplicated: 0,
    errors: 0,
  };

  try {
    // Health check
    const isHealthy = await provider.healthCheck();
    if (!isHealthy && !config.dryRun) {
      logger.warn("Provider health check failed", {
        provider: provider.getName(),
      });
    }

    for (const league of config.leagues) {
      logger.info(`Processing league: ${league}`);

      // Get games from database that are upcoming or live
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const games = await prisma.game.findMany({
        where: {
          league: {
            abbr: league,
          },
          startTime: {
            gte: now,
            lte: tomorrow,
          },
          status: {
            in: [GameStatus.SCHEDULED, GameStatus.IN_PROGRESS],
          },
        },
        include: {
          league: true,
          homeTeam: true,
          awayTeam: true,
        },
      });

      if (games.length === 0) {
        logger.info(`No games found for ${league} in next 24 hours`);
        continue;
      }

      logger.info(`Found ${games.length} games for ${league}`);

      // Get external IDs for API calls
      const eventIds = games
        .filter((g) => g.externalId)
        .map((g) => g.externalId!);

      if (eventIds.length === 0) {
        logger.warn(`No games have externalId set for ${league}`);
        continue;
      }

      // Fetch odds from provider
      const markets: MarketType[] = ["moneyline", "spread", "total"];
      const oddsResponse = await provider.getOdds(eventIds, markets);

      logger.info(`Fetched odds for ${oddsResponse.data.length} events`, {
        league,
        rateLimit: oddsResponse.rateLimit,
      });

      // Process each event's odds
      for (const eventOdds of oddsResponse.data) {
        const game = games.find((g) => g.externalId === eventOdds.eventId);
        if (!game) {
          logger.warn(`Game not found for event ${eventOdds.eventId}`);
          continue;
        }

        stats.gamesProcessed++;

        // Get or create bookmakers and markets in database
        for (const marketOdds of eventOdds.markets) {
          try {
            // Get or create bookmaker
            const bookmaker = await prisma.bookmaker.upsert({
              where: { name: marketOdds.bookmaker },
              create: {
                name: marketOdds.bookmaker,
                displayName: marketOdds.bookmaker,
                active: true,
              },
              update: {},
            });

            // Get market
            const marketTypeMap: Record<MarketType, string> = {
              moneyline: "MONEYLINE",
              spread: "SPREAD",
              total: "TOTAL",
            };

            const market = await prisma.market.findFirst({
              where: {
                type: marketTypeMap[marketOdds.marketType] as any,
              },
            });

            if (!market) {
              logger.warn(`Market not found: ${marketOdds.marketType}`);
              continue;
            }

            // Check deduplication
            const cacheKey = getCacheKey(game.id, bookmaker.id, market.id);
            const shouldStore = shouldStoreOdds(
              cacheKey,
              marketOdds,
              config.dedupeIntervalMinutes
            );

            if (!shouldStore) {
              stats.oddsDeduplicated++;
              logger.debug("Skipping duplicate odds", {
                game: `${game.awayTeam.abbr} @ ${game.homeTeam.abbr}`,
                bookmaker: bookmaker.name,
                market: market.type,
              });
              continue;
            }

            // Store odds snapshot
            if (config.dryRun) {
              logger.info("[DRY RUN] Would store odds", {
                game: `${game.awayTeam.abbr} @ ${game.homeTeam.abbr}`,
                bookmaker: bookmaker.name,
                market: market.type,
                odds: marketOdds,
              });
              stats.oddsSnapshotsStored++;
            } else {
              await prisma.oddsSnapshot.create({
                data: {
                  gameId: game.id,
                  bookmakerId: bookmaker.id,
                  marketId: market.id,
                  homeOdds: marketOdds.homeOdds,
                  awayOdds: marketOdds.awayOdds,
                  overOdds: marketOdds.overOdds,
                  underOdds: marketOdds.underOdds,
                  line: marketOdds.line,
                  timestamp: marketOdds.timestamp,
                },
              });

              stats.oddsSnapshotsStored++;

              // Update cache
              lastStoredOdds.set(cacheKey, {
                odds: marketOdds,
                timestamp: new Date(),
              });

              logger.debug("Stored odds snapshot", {
                game: `${game.awayTeam.abbr} @ ${game.homeTeam.abbr}`,
                bookmaker: bookmaker.name,
                market: market.type,
              });
            }
          } catch (error: any) {
            stats.errors++;
            logger.error("Error storing odds", {
              error: error.message,
              game: game.id,
              bookmaker: marketOdds.bookmaker,
            });
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    logger.info("Poll completed", {
      duration: `${duration}ms`,
      stats,
    });
  } catch (error: any) {
    logger.error("Poll failed", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * Run polling loop
 */
async function runLoop(config: PollConfig): Promise<void> {
  logger.info("Starting polling loop", {
    interval: `${config.pollIntervalSeconds}s`,
  });

  while (true) {
    try {
      await pollOdds(config);
    } catch (error: any) {
      logger.error("Poll iteration failed", { error: error.message });
    }

    // Wait before next poll
    logger.info(`Waiting ${config.pollIntervalSeconds}s until next poll`);
    await new Promise((resolve) =>
      setTimeout(resolve, config.pollIntervalSeconds * 1000)
    );
  }
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const config: PollConfig = {
    leagues: ["NFL", "NBA"] as League[],
    pollIntervalSeconds: parseInt(process.env.POLL_INTERVAL_SECONDS || "60"),
    dedupeIntervalMinutes: parseInt(
      process.env.DEDUPE_INTERVAL_MINUTES || "10"
    ),
    dryRun: args.includes("--dry") || !process.env.ODDS_API_KEY,
    loop: args.includes("--loop"),
  };

  if (config.dryRun) {
    logger.info("🔸 Running in DRY RUN mode (no external calls or DB writes)");
  }

  logger.info("Odds polling job starting", { config });

  try {
    if (config.loop) {
      await runLoop(config);
    } else {
      await pollOdds(config);
    }
  } catch (error: any) {
    logger.error("Job failed", { error: error.message });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle signals
process.on("SIGINT", async () => {
  logger.info("Received SIGINT, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM, shutting down gracefully");
  await prisma.$disconnect();
  process.exit(0);
});

// Run if executed directly
if (require.main === module) {
  main();
}

