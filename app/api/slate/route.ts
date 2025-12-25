// GET /api/slate
// Get today's slate of games for a league

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/api/errors";
import { GetSlateQuerySchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "games": [
 *     {
 *       "id": "clx123",
 *       "league": "NBA",
 *       "homeTeam": { "id": "clx1", "name": "Los Angeles Lakers", "abbr": "LAL" },
 *       "awayTeam": { "id": "clx2", "name": "Boston Celtics", "abbr": "BOS" },
 *       "startTime": "2024-12-24T02:00:00.000Z",
 *       "status": "SCHEDULED",
 *       "homeScore": null,
 *       "awayScore": null,
 *       "venue": "Crypto.com Arena"
 *     }
 *   ],
 *   "count": 10,
 *   "date": "2024-12-24"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = GetSlateQuerySchema.parse({
      league: searchParams.get("league"),
      date: searchParams.get("date"),
    });

    // Parse date or default to today
    const targetDate = query.date ? new Date(query.date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Build query filters
    const where: any = {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (query.league) {
      where.league = { abbr: query.league };
    }

    // Fetch games
    const games = await prisma.game.findMany({
      where,
      include: {
        league: { select: { id: true, abbr: true, name: true } },
        homeTeam: { select: { id: true, name: true, abbr: true, city: true } },
        awayTeam: { select: { id: true, name: true, abbr: true, city: true } },
      },
      orderBy: { startTime: "asc" },
    }).catch(() => []);

    return NextResponse.json({
      games: games.map((game) => ({
        id: game.id,
        league: game.league.abbr,
        homeTeam: {
          id: game.homeTeam.id,
          name: game.homeTeam.name,
          abbr: game.homeTeam.abbr,
          city: game.homeTeam.city,
        },
        awayTeam: {
          id: game.awayTeam.id,
          name: game.awayTeam.name,
          abbr: game.awayTeam.abbr,
          city: game.awayTeam.city,
        },
        startTime: game.startTime,
        status: game.status,
        homeScore: game.homeScore,
        awayScore: game.awayScore,
        venue: game.venue,
      })),
      count: games.length,
      date: startOfDay.toISOString().split("T")[0],
    });
  } catch (error) {
    return errorResponse(error);
  }
}
