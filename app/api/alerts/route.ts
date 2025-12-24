// POST /api/alerts
// Create an alert for odds movement or game start

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth } from "@/lib/api/auth";
import { checkRateLimit, rateLimits } from "@/lib/api/rateLimit";
import { CreateAlertSchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "alert": {
 *     "id": "clx789",
 *     "gameId": "clx123",
 *     "type": "ODDS_MOVE",
 *     "status": "ACTIVE",
 *     "oddsThreshold": 10,
 *     "createdAt": "2024-12-24T02:00:00.000Z",
 *     "game": {
 *       "homeTeam": "Lakers",
 *       "awayTeam": "Celtics",
 *       "startTime": "2024-12-24T22:00:00.000Z"
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Check rate limit (10 alerts per minute)
    const rateLimit = checkRateLimit(`alerts:${(user as any).id}`, rateLimits.standard);
    if (!rateLimit.allowed) {
      throw errors.rateLimit(rateLimit.retryAfter!);
    }

    // Parse and validate request body
    const body = await request.json();
    const data = CreateAlertSchema.parse(body);

    // Verify game exists
    const game = await prisma.game.findUnique({
      where: { id: data.gameId },
      include: {
        homeTeam: { select: { abbr: true } },
        awayTeam: { select: { abbr: true } },
      },
    });

    if (!game) {
      throw errors.notFound("Game");
    }

    // Validate alert type requirements
    if (data.type === "ODDS_MOVE" && !data.oddsThreshold) {
      throw errors.badRequest("oddsThreshold is required for ODDS_MOVE alerts");
    }

    if (data.type === "GAME_START" && !data.minutesBefore) {
      throw errors.badRequest(
        "minutesBefore is required for GAME_START alerts"
      );
    }

    // Create alert
    const alert = await prisma.alert.create({
      data: {
        userId: (user as any).id,
        gameId: data.gameId,
        type: data.type,
        oddsThreshold: data.oddsThreshold,
        minutesBefore: data.minutesBefore,
        status: "ACTIVE",
      },
      include: {
        game: {
          include: {
            homeTeam: { select: { abbr: true } },
            awayTeam: { select: { abbr: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        alert: {
          id: alert.id,
          gameId: alert.gameId,
          type: alert.type,
          status: alert.status,
          oddsThreshold: alert.oddsThreshold,
          minutesBefore: alert.minutesBefore,
          createdAt: alert.createdAt,
          game: alert.game ? {
            homeTeam: alert.game.homeTeam.abbr,
            awayTeam: alert.game.awayTeam.abbr,
            startTime: alert.game.startTime,
          } : null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
