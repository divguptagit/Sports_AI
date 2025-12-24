// GET /api/game/:id/odds/history
// Get odds history for a game (requires age verification)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth, requireAgeVerification } from "@/lib/api/auth";
import { GetOddsHistoryQuerySchema } from "@/lib/api/validation";

/**
 * Example Response:
 * {
 *   "gameId": "clx123",
 *   "market": "SPREAD",
 *   "bookmaker": "draftkings",
 *   "history": [
 *     {
 *       "timestamp": "2024-12-24T00:00:00.000Z",
 *       "homeOdds": -110,
 *       "awayOdds": -110,
 *       "line": -3.0
 *     },
 *     {
 *       "timestamp": "2024-12-24T01:00:00.000Z",
 *       "homeOdds": -110,
 *       "awayOdds": -110,
 *       "line": -3.5
 *     }
 *   ],
 *   "count": 2
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication and age verification
    const user = await requireAuth();
    await requireAgeVerification(user.id);

    const { searchParams } = new URL(request.url);
    const query = GetOddsHistoryQuerySchema.parse({
      market: searchParams.get("market"),
      bookmaker: searchParams.get("bookmaker"),
      hours: searchParams.get("hours"),
    });

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { id: params.id },
    });

    if (!game) {
      throw errors.notFound("Game");
    }

    // Calculate time range
    const now = new Date();
    const since = new Date(now.getTime() - query.hours * 60 * 60 * 1000);

    // Build query
    const where: any = {
      gameId: params.id,
      timestamp: { gte: since },
    };

    if (query.market) {
      where.market = { type: query.market };
    }

    if (query.bookmaker) {
      where.bookmaker = { name: query.bookmaker };
    }

    // Fetch history
    const history = await prisma.oddsSnapshot.findMany({
      where,
      include: {
        bookmaker: { select: { name: true, displayName: true } },
        market: { select: { type: true } },
      },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json({
      gameId: params.id,
      market: query.market || "all",
      bookmaker: query.bookmaker || "all",
      history: history.map((odds) => ({
        timestamp: odds.timestamp,
        bookmaker: odds.bookmaker.name,
        market: odds.market.type,
        homeOdds: odds.homeOdds,
        awayOdds: odds.awayOdds,
        overOdds: odds.overOdds,
        underOdds: odds.underOdds,
        line: odds.line,
      })),
      count: history.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

