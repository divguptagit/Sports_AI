/**
 * Baseline Prediction Model
 * 
 * This is a market-derived baseline that normalizes bookmaker odds
 * to create a "fair" probability estimate by removing the vig.
 * 
 * IMPORTANT: This is NOT betting advice or predictions.
 * This is for analytical purposes only to establish a baseline.
 * 
 * The baseline assumes the market is efficient and uses the wisdom
 * of the crowd (aggregated bookmaker odds) as the probability estimate.
 */

import {
  americanToImpliedProb,
  removeVig,
  calculateEdge,
  getConfidenceTier,
} from "./odds";

export interface BaselinePrediction {
  side: "HOME" | "AWAY" | "OVER" | "UNDER";
  modelProbability: number; // Normalized market probability
  impliedProbability: number; // Raw bookmaker probability
  edge: number; // Percentage edge
  confidenceTier: "high" | "medium" | "low" | "none";
  vig: number; // Bookmaker's edge
  dataFreshness: number; // Minutes since last update
  source: "baseline-market-derived";
}

export interface TwoWayMarketOdds {
  homeOdds: number;
  awayOdds: number;
  timestamp: Date;
}

/**
 * Generate baseline prediction for a two-way market
 * 
 * Uses normalized market probabilities (with vig removed) as the model.
 * This creates a "fair" baseline assuming the market is efficient.
 * 
 * @param odds Market odds for both sides
 * @returns Predictions for both sides
 */
export function generateBaselinePrediction(
  odds: TwoWayMarketOdds
): { home: BaselinePrediction; away: BaselinePrediction } {
  const { homeProb, awayProb, vig } = removeVig(odds.homeOdds, odds.awayOdds);

  const dataFreshness = (Date.now() - odds.timestamp.getTime()) / 1000 / 60;

  const homeImplied = americanToImpliedProb(odds.homeOdds);
  const awayImplied = americanToImpliedProb(odds.awayOdds);

  const homeEdge = calculateEdge(homeProb, odds.homeOdds);
  const awayEdge = calculateEdge(awayProb, odds.awayOdds);

  return {
    home: {
      side: "HOME",
      modelProbability: homeProb,
      impliedProbability: homeImplied,
      edge: homeEdge,
      confidenceTier: getConfidenceTier(homeEdge, dataFreshness),
      vig,
      dataFreshness,
      source: "baseline-market-derived",
    },
    away: {
      side: "AWAY",
      modelProbability: awayProb,
      impliedProbability: awayImplied,
      edge: awayEdge,
      confidenceTier: getConfidenceTier(awayEdge, dataFreshness),
      vig,
      dataFreshness,
      source: "baseline-market-derived",
    },
  };
}

/**
 * Find best odds across multiple bookmakers
 * 
 * For analytics: identifies the most favorable odds available
 * 
 * @param bookmakers Array of bookmaker odds
 * @returns Best odds for each side
 */
export function findBestOdds(
  bookmakers: Array<{ name: string; homeOdds: number; awayOdds: number }>
): {
  home: { odds: number; bookmaker: string };
  away: { odds: number; bookmaker: string };
} {
  let bestHome = { odds: -Infinity, bookmaker: "" };
  let bestAway = { odds: -Infinity, bookmaker: "" };

  for (const book of bookmakers) {
    // For favorites (negative odds), closer to 0 is better (e.g., -105 > -110)
    // For underdogs (positive odds), higher is better (e.g., +150 > +130)
    if (
      book.homeOdds > bestHome.odds ||
      (book.homeOdds < 0 &&
        bestHome.odds < 0 &&
        Math.abs(book.homeOdds) < Math.abs(bestHome.odds))
    ) {
      bestHome = { odds: book.homeOdds, bookmaker: book.name };
    }

    if (
      book.awayOdds > bestAway.odds ||
      (book.awayOdds < 0 &&
        bestAway.odds < 0 &&
        Math.abs(book.awayOdds) < Math.abs(bestAway.odds))
    ) {
      bestAway = { odds: book.awayOdds, bookmaker: book.name };
    }
  }

  return { home: bestHome, away: bestAway };
}

/**
 * Calculate consensus probability from multiple bookmakers
 * 
 * Takes the average of normalized probabilities across bookmakers
 * 
 * @param bookmakers Array of bookmaker odds
 * @returns Consensus probabilities
 */
export function calculateConsensus(
  bookmakers: Array<{ homeOdds: number; awayOdds: number }>
): { homeProb: number; awayProb: number; avgVig: number } {
  if (bookmakers.length === 0) {
    return { homeProb: 0.5, awayProb: 0.5, avgVig: 0 };
  }

  let totalHomeProb = 0;
  let totalAwayProb = 0;
  let totalVig = 0;

  for (const book of bookmakers) {
    const { homeProb, awayProb, vig } = removeVig(book.homeOdds, book.awayOdds);
    totalHomeProb += homeProb;
    totalAwayProb += awayProb;
    totalVig += vig;
  }

  return {
    homeProb: totalHomeProb / bookmakers.length,
    awayProb: totalAwayProb / bookmakers.length,
    avgVig: totalVig / bookmakers.length,
  };
}

