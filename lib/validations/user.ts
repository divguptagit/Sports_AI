import { z } from "zod";

export const UserPreferencesSchema = z.object({
  defaultSport: z.enum(["NFL", "NBA", "MLB", "NHL", "NCAAF", "NCAAB"]),
  defaultUnits: z.number().min(0.1).max(10).default(1),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.boolean().default(true),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

