/**
 * Odds Conversion and Analytics Utilities
 * 
 * These utilities are for analytics purposes only.
 * NOT betting advice or recommendations.
 */

/**
 * Convert American odds to implied probability
 * @param odds American odds (e.g., -110, +150)
 * @returns Implied probability (0-1)
 */
export function americanToImpliedProb(odds: number): number {
  if (odds === 0) return 0;

  if (odds > 0) {
    // Underdog odds (e.g., +150)
    return 100 / (odds + 100);
  } else {
    // Favorite odds (e.g., -110)
    return Math.abs(odds) / (Math.abs(odds) + 100);
  }
}

/**
 * Convert implied probability to American odds
 * @param prob Implied probability (0-1)
 * @returns American odds
 */
export function impliedProbToAmerican(prob: number): number {
  if (prob <= 0 || prob >= 1) return 0;

  if (prob >= 0.5) {
    // Favorite odds (negative)
    return Math.round(-(prob / (1 - prob)) * 100);
  } else {
    // Underdog odds (positive)
    return Math.round(((1 - prob) / prob) * 100);
  }
}

/**
 * Calculate decimal odds from American odds
 * @param odds American odds
 * @returns Decimal odds
 */
export function americanToDecimal(odds: number): number {
  if (odds === 0) return 0;

  if (odds > 0) {
    return 1 + odds / 100;
  } else {
    return 1 + 100 / Math.abs(odds);
  }
}

/**
 * Remove vig (vigorish) from two-way market odds to get fair probabilities
 * 
 * In two-way markets (moneyline, totals), bookmakers add "vig" or "juice"
 * which makes the sum of implied probabilities > 1.0
 * 
 * This normalizes the probabilities to sum to 1.0
 * 
 * @param homeOdds Home/favorite odds
 * @param awayOdds Away/underdog odds
 * @returns Normalized probabilities
 */
export function removeVig(
  homeOdds: number,
  awayOdds: number
): { homeProb: number; awayProb: number; vig: number } {
  const homeImplied = americanToImpliedProb(homeOdds);
  const awayImplied = americanToImpliedProb(awayOdds);

  const total = homeImplied + awayImplied;
  const vig = total - 1.0; // The bookmaker's edge

  // Normalize to sum to 1.0
  const homeProb = homeImplied / total;
  const awayProb = awayImplied / total;

  return { homeProb, awayProb, vig };
}

/**
 * Calculate betting edge
 * 
 * Edge = Model Probability - Implied Probability
 * 
 * Positive edge suggests value (model thinks probability is higher than market)
 * Negative edge suggests poor value
 * 
 * NOTE: This is for analytics only, not betting advice
 * 
 * @param modelProb Your model's estimated probability
 * @param marketOdds Market odds (American format)
 * @returns Edge as a percentage
 */
export function calculateEdge(modelProb: number, marketOdds: number): number {
  const impliedProb = americanToImpliedProb(marketOdds);
  return (modelProb - impliedProb) * 100;
}

/**
 * Calculate expected value (EV)
 * 
 * EV = (Win Probability × Profit) - (Loss Probability × Stake)
 * 
 * NOTE: This is for analytics only, not betting advice
 * 
 * @param modelProb Your model's estimated probability
 * @param odds American odds
 * @param stake Bet amount (default 1 unit)
 * @returns Expected value
 */
export function calculateEV(
  modelProb: number,
  odds: number,
  stake: number = 1
): number {
  const decimalOdds = americanToDecimal(odds);
  const profit = (decimalOdds - 1) * stake;
  const lossProb = 1 - modelProb;

  return modelProb * profit - lossProb * stake;
}

/**
 * Confidence tier based on edge magnitude and data quality
 * 
 * @param edge Edge percentage
 * @param dataFreshness Minutes since last update
 * @returns Confidence tier
 */
export function getConfidenceTier(
  edge: number,
  dataFreshness: number = 0
): "high" | "medium" | "low" | "none" {
  const absEdge = Math.abs(edge);

  // Penalize stale data
  const freshnessMultiplier = dataFreshness > 60 ? 0.5 : 1.0;
  const adjustedEdge = absEdge * freshnessMultiplier;

  if (adjustedEdge >= 5) return "high";
  if (adjustedEdge >= 2.5) return "medium";
  if (adjustedEdge >= 1) return "low";
  return "none";
}

/**
 * Format odds for display
 * @param odds American odds
 * @returns Formatted string (e.g., "-110", "+150")
 */
export function formatOdds(odds: number): string {
  if (odds === 0) return "N/A";
  return odds > 0 ? `+${odds}` : odds.toString();
}

/**
 * Format probability as percentage
 * @param prob Probability (0-1)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatProbability(prob: number, decimals: number = 1): string {
  return `${(prob * 100).toFixed(decimals)}%`;
}

