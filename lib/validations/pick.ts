import { z } from "zod";

export const PickSchema = z.object({
  id: z.string().optional(),
  sport: z.enum(["NFL", "NBA", "MLB", "NHL", "NCAAF", "NCAAB"]),
  gameDate: z.date(),
  team: z.string().min(1, "Team is required"),
  opponent: z.string().min(1, "Opponent is required"),
  pickType: z.enum(["moneyline", "spread", "total"]),
  value: z.number(),
  units: z.number().min(0.1).max(10),
  odds: z.number(),
  result: z.enum(["win", "loss", "push", "pending"]).default("pending"),
  notes: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

export type Pick = z.infer<typeof PickSchema>;

export const CreatePickSchema = PickSchema.omit({
  id: true,
  result: true,
  createdAt: true,
});

export type CreatePick = z.infer<typeof CreatePickSchema>;

