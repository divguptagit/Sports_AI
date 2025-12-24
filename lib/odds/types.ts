// Odds Provider Types

export type League = "NFL" | "NBA" | "MLB" | "NHL" | "NCAAF" | "NCAAB";

export type MarketType = "moneyline" | "spread" | "total";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface OddsEvent {
  id: string;
  sport: League;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status?: "scheduled" | "live" | "completed";
}

export interface MarketOdds {
  bookmaker: string;
  marketType: MarketType;
  homeOdds?: number;
  awayOdds?: number;
  overOdds?: number;
  underOdds?: number;
  line?: number; // Spread or total line
  timestamp: Date;
}

export interface EventOdds {
  eventId: string;
  markets: MarketOdds[];
}

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface RateLimitInfo {
  remaining: number;
  reset: Date;
  limit: number;
}

export interface ProviderResponse<T> {
  data: T;
  rateLimit?: RateLimitInfo;
}
