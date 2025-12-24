// GET /api/game/:id
// Get detailed game information

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";

/**
 * Example Response:
 * {
 *   "id": "clx123",
 *   "league": { "abbr": "NBA", "name": "National Basketball Association" },
 *   "homeTeam": {
 *     "id": "clx1",
 *     "name": "Los Angeles Lakers",
 *     "abbr": "LAL",
 *     "city": "Los Angeles",
 *     "primaryColor": "#552583"
 *   },
 *   "awayTeam": { ... },
 *   "startTime": "2024-12-24T02:00:00.000Z",
 *   "status": "SCHEDULED",
 *   "homeScore": null,
 *   "awayScore": null,
 *   "venue": "Crypto.com Arena",
 *   "hasOdds": true
 * }
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      include: {
        league: { select: { abbr: true, name: true } },
        homeTeam: true,
        awayTeam: true,
        oddsSnapshots: {
          take: 1,
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!game) {
      throw errors.notFound("Game");
    }

    return NextResponse.json({
      id: game.id,
      league: {
        abbr: game.league.abbr,
        name: game.league.name,
      },
      homeTeam: {
        id: game.homeTeam.id,
        name: game.homeTeam.name,
        abbr: game.homeTeam.abbr,
        city: game.homeTeam.city,
        primaryColor: game.homeTeam.primaryColor,
      },
      awayTeam: {
        id: game.awayTeam.id,
        name: game.awayTeam.name,
        abbr: game.awayTeam.abbr,
        city: game.awayTeam.city,
        primaryColor: game.awayTeam.primaryColor,
      },
      startTime: game.startTime,
      status: game.status,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      venue: game.venue,
      hasOdds: game.oddsSnapshots.length > 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
