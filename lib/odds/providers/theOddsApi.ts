// The Odds API Provider Implementation
// API Docs: https://the-odds-api.com/liveapi/guides/v4/
// Analytics only - no wagering functionality

import {
  OddsProvider,
  normalizeBookmakerName,
  normalizeMarketType,
} from "../provider";
import {
  League,
  DateRange,
  OddsEvent,
  EventOdds,
  MarketType,
  ProviderConfig,
  ProviderResponse,
  RateLimitInfo,
} from "../types";

interface TheOddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: TheOddsApiBookmaker[];
}

interface TheOddsApiBookmaker {
  key: string;
  title: string;
  markets: TheOddsApiMarket[];
}

interface TheOddsApiMarket {
  key: string; // "h2h", "spreads", "totals"
  outcomes: TheOddsApiOutcome[];
}

interface TheOddsApiOutcome {
  name: string;
  price: number; // American odds
  point?: number; // Spread or total line
}

const SPORT_KEYS: Record<League, string> = {
  NFL: "americanfootball_nfl",
  NBA: "basketball_nba",
  MLB: "baseball_mlb",
  NHL: "icehockey_nhl",
  NCAAF: "americanfootball_ncaaf",
  NCAAB: "basketball_ncaab",
};

const MARKET_KEYS: Record<MarketType, string> = {
  moneyline: "h2h",
  spread: "spreads",
  total: "totals",
};

export class TheOddsApiProvider implements OddsProvider {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey || process.env.ODDS_API_KEY || "";
    this.baseUrl = config.baseUrl || "https://api.the-odds-api.com/v4";
    this.timeout = config.timeout || 10000;
    this.maxRetries = config.maxRetries || 3;

    if (!this.apiKey) {
      console.warn(
        "⚠️  ODDS_API_KEY not configured - provider will run in stub mode"
      );
    }
  }

  getName(): string {
    return "The Odds API";
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/sports`, {
        headers: { "X-Api-Key": this.apiKey },
        signal: AbortSignal.timeout(this.timeout),
      });
      return response.ok;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  async getEvents(
    league: League,
    dateRange?: DateRange
  ): Promise<ProviderResponse<OddsEvent[]>> {
    if (!this.apiKey) {
      console.log(`🔸 Stub mode: Would fetch ${league} events`);
      return { data: [] };
    }

    const sportKey = SPORT_KEYS[league];
    if (!sportKey) {
      throw new Error(`Unsupported league: ${league}`);
    }

    const url = `${this.baseUrl}/sports/${sportKey}/odds`;
    const params = new URLSearchParams({
      regions: "us",
      oddsFormat: "american",
      dateFormat: "iso",
    });

    const response = await this.fetchWithRetry(url + "?" + params.toString());
    const events: TheOddsApiEvent[] = await response.json();

    const rateLimit = this.extractRateLimit(response);

    // Filter by date range if provided
    let filteredEvents = events;
    if (dateRange) {
      filteredEvents = events.filter((event) => {
        const startTime = new Date(event.commence_time);
        return startTime >= dateRange.from && startTime <= dateRange.to;
      });
    }

    const data = filteredEvents.map((event) => ({
      id: event.id,
      sport: league,
      homeTeam: event.home_team,
      awayTeam: event.away_team,
      startTime: new Date(event.commence_time),
      status: "scheduled" as const,
    }));

    return { data, rateLimit };
  }

  async getOdds(
    eventIds: string[],
    markets: MarketType[] = ["moneyline", "spread", "total"],
    isLive: boolean = false
  ): Promise<ProviderResponse<EventOdds[]>> {
    if (!this.apiKey) {
      console.log(
        `🔸 Stub mode: Would fetch odds for ${eventIds.length} events`
      );
      return { data: [] };
    }

    if (eventIds.length === 0) {
      return { data: [] };
    }

    // The Odds API fetches odds per sport, not per event
    // So we need to fetch all events and filter
    // For better performance, group by sport if needed
    const allOdds: EventOdds[] = [];

    // Get first event to determine sport
    // In production, you'd track this or query from database
    const eventId = eventIds[0];
    const sport = this.inferSportFromEventId(eventId);

    const sportKey = SPORT_KEYS[sport as League];
    if (!sportKey) {
      throw new Error(`Cannot determine sport for event: ${eventId}`);
    }

    const marketKeys = markets.map((m) => MARKET_KEYS[m]).join(",");

    const url = `${this.baseUrl}/sports/${sportKey}/odds`;
    const params = new URLSearchParams({
      regions: "us",
      markets: marketKeys,
      oddsFormat: "american",
      dateFormat: "iso",
    });

    const response = await this.fetchWithRetry(url + "?" + params.toString());
    const events: TheOddsApiEvent[] = await response.json();

    const rateLimit = this.extractRateLimit(response);

    // Filter to requested events and transform
    const filteredEvents = events.filter((e) => eventIds.includes(e.id));

    for (const event of filteredEvents) {
      const marketOdds = this.transformBookmakerData(event);
      allOdds.push({
        eventId: event.id,
        markets: marketOdds,
      });
    }

    return { data: allOdds, rateLimit };
  }

  private transformBookmakerData(event: TheOddsApiEvent): any[] {
    const results: any[] = [];

    if (!event.bookmakers) {
      return results;
    }

    const timestamp = new Date();

    for (const bookmaker of event.bookmakers) {
      const normalizedBookmaker = normalizeBookmakerName(bookmaker.key);

      for (const market of bookmaker.markets) {
        const marketType = normalizeMarketType(market.key);
        if (!marketType) continue;

        const odds: any = {
          bookmaker: normalizedBookmaker,
          marketType,
          timestamp,
        };

        if (marketType === "moneyline") {
          // h2h market
          const homeOutcome = market.outcomes.find(
            (o) => o.name === event.home_team
          );
          const awayOutcome = market.outcomes.find(
            (o) => o.name === event.away_team
          );

          odds.homeOdds = homeOutcome?.price;
          odds.awayOdds = awayOutcome?.price;
        } else if (marketType === "spread") {
          const homeOutcome = market.outcomes.find(
            (o) => o.name === event.home_team
          );
          const awayOutcome = market.outcomes.find(
            (o) => o.name === event.away_team
          );

          odds.homeOdds = homeOutcome?.price;
          odds.awayOdds = awayOutcome?.price;
          odds.line = homeOutcome?.point; // Home team spread
        } else if (marketType === "total") {
          const overOutcome = market.outcomes.find((o) =>
            o.name.toLowerCase().includes("over")
          );
          const underOutcome = market.outcomes.find((o) =>
            o.name.toLowerCase().includes("under")
          );

          odds.overOdds = overOutcome?.price;
          odds.underOdds = underOutcome?.price;
          odds.line = overOutcome?.point; // Total line
        }

        results.push(odds);
      }
    }

    return results;
  }

  private async fetchWithRetry(url: string, attempt = 1): Promise<Response> {
    try {
      const response = await fetch(url, {
        headers: {
          "X-Api-Key": this.apiKey,
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        if (response.status === 429 && attempt <= this.maxRetries) {
          // Rate limited - exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(
            `⏳ Rate limited, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`
          );
          await this.sleep(delay);
          return this.fetchWithRetry(url, attempt + 1);
        }

        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      if (attempt <= this.maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(
          `⏳ Request failed, retrying in ${delay}ms (attempt ${attempt}/${this.maxRetries})`
        );
        await this.sleep(delay);
        return this.fetchWithRetry(url, attempt + 1);
      }
      throw error;
    }
  }

  private extractRateLimit(response: Response): RateLimitInfo | undefined {
    const remaining = response.headers.get("x-requests-remaining");
    const used = response.headers.get("x-requests-used");

    if (remaining) {
      return {
        remaining: parseInt(remaining),
        limit: parseInt(used || "0") + parseInt(remaining),
        reset: new Date(Date.now() + 3600000), // Typically resets hourly
      };
    }

    return undefined;
  }

  private inferSportFromEventId(eventId: string): string {
    // The Odds API event IDs often contain the sport key
    // This is a heuristic - in production, track this in your DB
    if (eventId.includes("nfl")) return "NFL";
    if (eventId.includes("nba")) return "NBA";
    if (eventId.includes("mlb")) return "MLB";
    if (eventId.includes("nhl")) return "NHL";

    // Default fallback
    return "NBA";
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
