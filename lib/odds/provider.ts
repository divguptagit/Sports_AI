// Odds Provider Interface
// Analytics only - no wagering functionality

import {
  League,
  DateRange,
  OddsEvent,
  EventOdds,
  MarketType,
  ProviderResponse,
} from "./types";

/**
 * Base interface for odds data providers
 * This is an analytics-only interface - no betting functionality
 */
export interface OddsProvider {
  /**
   * Get list of events for a league within a date range
   * @param league - The sports league (NFL, NBA, etc.)
   * @param dateRange - Optional date range filter
   * @returns List of events with basic info
   */
  getEvents(
    league: League,
    dateRange?: DateRange
  ): Promise<ProviderResponse<OddsEvent[]>>;

  /**
   * Get odds for specific events
   * @param eventIds - Array of event IDs to fetch odds for
   * @param markets - Market types to include (moneyline, spread, total)
   * @param isLive - Whether to fetch live odds or pre-game odds
   * @returns Odds data for each event
   */
  getOdds(
    eventIds: string[],
    markets?: MarketType[],
    isLive?: boolean
  ): Promise<ProviderResponse<EventOdds[]>>;

  /**
   * Health check for the provider
   * @returns true if provider is accessible
   */
  healthCheck(): Promise<boolean>;

  /**
   * Get provider name
   */
  getName(): string;
}

/**
 * Normalize bookmaker names to consistent format
 */
export function normalizeBookmakerName(name: string): string {
  const normalized: Record<string, string> = {
    draftkings: "draftkings",
    fanduel: "fanduel",
    betmgm: "betmgm",
    caesars: "caesars",
    pointsbet: "pointsbet",
    betonline: "betonline",
    bovada: "bovada",
    mybookie: "mybookie",
    // Add more mappings as needed
  };

  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized[key] || key;
}

/**
 * Normalize market type to standard format
 */
export function normalizeMarketType(market: string): MarketType | null {
  const normalized = market.toLowerCase().replace(/[^a-z]/g, "");

  if (normalized.includes("moneyline") || normalized === "h2h") {
    return "moneyline";
  }
  if (normalized.includes("spread") || normalized.includes("handicap")) {
    return "spread";
  }
  if (normalized.includes("total") || normalized.includes("over")) {
    return "total";
  }

  return null;
}

