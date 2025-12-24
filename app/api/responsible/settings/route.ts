// POST /api/responsible/settings
// Update responsible gaming settings

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth } from "@/lib/api/auth";
import { checkRateLimit, rateLimits } from "@/lib/api/rateLimit";
import { UpdateResponsibleSettingsSchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "settings": {
 *     "dailyTimeLimit": 120,
 *     "sessionTimeLimit": 60,
 *     "enableBreakReminders": true,
 *     "breakReminderInterval": 30,
 *     "cooldownUntil": null,
 *     "updatedAt": "2024-12-24T02:00:00.000Z"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Check rate limit
    const rateLimit = checkRateLimit(
      `settings:${user.id}`,
      rateLimits.standard
    );
    if (!rateLimit.allowed) {
      throw errors.rateLimit(rateLimit.retryAfter!);
    }

    // Parse and validate request body
    const body = await request.json();
    const data = UpdateResponsibleSettingsSchema.parse(body);

    // Update settings
    const settings = await prisma.responsibleSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...data,
      },
      update: data,
    });

    return NextResponse.json({
      settings: {
        dailyTimeLimit: settings.dailyTimeLimit,
        sessionTimeLimit: settings.sessionTimeLimit,
        enableBreakReminders: settings.enableBreakReminders,
        breakReminderInterval: settings.breakReminderInterval,
        cooldownUntil: settings.cooldownUntil,
        updatedAt: settings.updatedAt,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

