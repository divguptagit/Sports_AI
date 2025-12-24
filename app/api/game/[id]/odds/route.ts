// GET /api/game/:id/odds
// Get latest odds for a game (requires age verification)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth, requireAgeVerification } from "@/lib/api/auth";
import { GetGameOddsQuerySchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "gameId": "clx123",
 *   "lastUpdate": "2024-12-24T01:30:00.000Z",
 *   "markets": [
 *     {
 *       "type": "MONEYLINE",
 *       "bookmakers": [
 *         {
 *           "name": "draftkings",
 *           "displayName": "DraftKings",
 *           "homeOdds": -150,
 *           "awayOdds": 130,
 *           "timestamp": "2024-12-24T01:30:00.000Z"
 *         }
 *       ]
 *     },
 *     {
 *       "type": "SPREAD",
 *       "bookmakers": [
 *         {
 *           "name": "draftkings",
 *           "displayName": "DraftKings",
 *           "homeOdds": -110,
 *           "awayOdds": -110,
 *           "line": -3.5,
 *           "timestamp": "2024-12-24T01:30:00.000Z"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication and age verification
    const user = await requireAuth();
    await requireAgeVerification(user.id);

    const { searchParams } = new URL(request.url);
    const query = GetGameOddsQuerySchema.parse({
      market: searchParams.get("market"),
      bookmaker: searchParams.get("bookmaker"),
    });

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id: params.id },
    });

    if (!game) {
      throw errors.notFound("Game");
    }

    // Build query for latest odds
    const where: any = { gameId: params.id };

    if (query.market) {
      where.market = { type: query.market };
    }

    if (query.bookmaker) {
      where.bookmaker = { name: query.bookmaker };
    }

    // Get latest odds per bookmaker/market combination
    const latestOdds = await prisma.oddsSnapshot.findMany({
      where,
      include: {
        bookmaker: { select: { name: true, displayName: true } },
        market: { select: { type: true, name: true } },
      },
      orderBy: { timestamp: "desc" },
      distinct: ["bookmakerId", "marketId"],
    });

    // Group by market type
    const marketMap = new Map<
      string,
      Array<{
        name: string;
        displayName: string;
        homeOdds: number | null;
        awayOdds: number | null;
        overOdds: number | null;
        underOdds: number | null;
        line: number | null;
        timestamp: Date;
      }>
    >();

    for (const odds of latestOdds) {
      const marketType = odds.market.type;
      if (!marketMap.has(marketType)) {
        marketMap.set(marketType, []);
      }

      marketMap.get(marketType)!.push({
        name: odds.bookmaker.name,
        displayName: odds.bookmaker.displayName,
        homeOdds: odds.homeOdds,
        awayOdds: odds.awayOdds,
        overOdds: odds.overOdds,
        underOdds: odds.underOdds,
        line: odds.line,
        timestamp: odds.timestamp,
      });
    }

    const markets = Array.from(marketMap.entries()).map(([type, bookmakers]) => ({
      type,
      bookmakers,
    }));

    const lastUpdate =
      latestOdds.length > 0
        ? latestOdds.reduce((latest, odds) =>
            odds.timestamp > latest ? odds.timestamp : latest
          , latestOdds[0].timestamp)
        : null;

    return NextResponse.json({
      gameId: params.id,
      lastUpdate,
      markets,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

