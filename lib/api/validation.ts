// API Validation Schemas

import { z } from "zod";

// ============================================================================
// Common Schemas
// ============================================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const DateSchema = z.coerce.date();

export const LeagueSchema = z.enum(["NFL", "NBA", "MLB", "NHL", "NCAAF", "NCAAB"]);

export const MarketTypeSchema = z.enum(["MONEYLINE", "SPREAD", "TOTAL"]);

// ============================================================================
// Slate API
// ============================================================================

export const GetSlateQuerySchema = z.object({
  league: LeagueSchema.optional(),
  date: z.string().optional(), // YYYY-MM-DD format
});

// ============================================================================
// Game API
// ============================================================================

export const GetGameOddsQuerySchema = z.object({
  market: MarketTypeSchema.optional(),
  bookmaker: z.string().optional(),
});

export const GetOddsHistoryQuerySchema = z.object({
  market: MarketTypeSchema.optional(),
  bookmaker: z.string().optional(),
  hours: z.coerce.number().int().min(1).max(72).default(24),
});

// ============================================================================
// Picks API
// ============================================================================

export const PickSideSchema = z.enum(["HOME", "AWAY", "OVER", "UNDER"]);

export const CreatePickSchema = z.object({
  gameId: z.string(),
  marketType: MarketTypeSchema,
  side: PickSideSchema,
  odds: z.number().min(-10000).max(10000), // American odds range
  line: z.number().optional(), // Spread or total line
  units: z.number().min(0.1).max(10).default(1),
  notes: z.string().max(500).optional(),
});

export const GetPicksQuerySchema = z.object({
  status: z.enum(["PENDING", "WIN", "LOSS", "PUSH", "CANCELLED"]).optional(),
  league: LeagueSchema.optional(),
  ...PaginationSchema.shape,
});

// ============================================================================
// Alerts API
// ============================================================================

export const AlertTypeSchema = z.enum(["ODDS_MOVE", "GAME_START"]);

export const CreateAlertSchema = z.object({
  gameId: z.string(),
  type: AlertTypeSchema,
  oddsThreshold: z.number().min(1).max(100).optional(), // For ODDS_MOVE
  minutesBefore: z.number().int().min(5).max(180).optional(), // For GAME_START
});

// ============================================================================
// Responsible Gaming API
// ============================================================================

export const VerifyAgeSchema = z.object({
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "Must agree to terms",
  }),
});

export const UpdateResponsibleSettingsSchema = z.object({
  dailyTimeLimit: z.number().int().min(0).max(1440).optional(), // Minutes
  sessionTimeLimit: z.number().int().min(0).max(480).optional(),
  enableBreakReminders: z.boolean().optional(),
  breakReminderInterval: z.number().int().min(15).max(120).optional(),
});

