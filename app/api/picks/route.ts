// POST /api/picks - Create simulated pick (requires age verification, checks cooldown)
// GET /api/me/picks - Get user's picks

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse, errors } from "@/lib/api/errors";
import { requireAuth, requirePickAccess } from "@/lib/api/auth";
import { checkRateLimit, rateLimits } from "@/lib/api/rateLimit";
import { CreatePickSchema, GetPicksQuerySchema } from "@/lib/api/validation";

/**
 * POST Example Response:
 * {
 *   "pick": {
 *     "id": "clx456",
 *     "gameId": "clx123",
 *     "market": "SPREAD",
 *     "side": "HOME",
 *     "odds": -110,
 *     "line": -3.5,
 *     "units": 1.0,
 *     "result": "PENDING",
 *     "pickedAt": "2024-12-24T02:00:00.000Z",
 *     "game": {
 *       "homeTeam": "Lakers",
 *       "awayTeam": "Celtics",
 *       "startTime": "2024-12-24T02:00:00.000Z"
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = (await requireAuth()) as any;

    // Check rate limit (5 picks per minute)
    const rateLimit = checkRateLimit(`picks:${user.id}`, rateLimits.strict);
    if (!rateLimit.allowed) {
      throw errors.rateLimit(rateLimit.retryAfter!);
    }

    // Enforce age verification and cooldown
    await requirePickAccess(user.id);

    // Parse and validate request body
    const body = await request.json();
    const data = CreatePickSchema.parse(body);

    // Verify game exists and hasn't started yet
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

    if (game.startTime < new Date()) {
      throw errors.badRequest("Cannot create pick for game that has started");
    }

    // Get market
    const market = await prisma.market.findFirst({
      where: { type: data.marketType },
    });

    if (!market) {
      throw errors.notFound("Market");
    }

    // Create pick
    const pick = await prisma.userPick.create({
      data: {
        userId: user.id,
        gameId: data.gameId,
        marketId: market.id,
        side: data.side,
        odds: data.odds,
        line: data.line,
        units: data.units,
        notes: data.notes,
        result: "PENDING",
      },
      include: {
        game: {
          include: {
            homeTeam: { select: { abbr: true } },
            awayTeam: { select: { abbr: true } },
          },
        },
        market: { select: { type: true } },
      },
    });

    return NextResponse.json(
      {
        pick: {
          id: pick.id,
          gameId: pick.gameId,
          market: pick.market.type,
          side: pick.side,
          odds: pick.odds,
          line: pick.line,
          units: pick.units,
          result: pick.result,
          notes: pick.notes,
          pickedAt: pick.pickedAt,
          game: {
            homeTeam: pick.game.homeTeam.abbr,
            awayTeam: pick.game.awayTeam.abbr,
            startTime: pick.game.startTime,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * GET Example Response:
 * {
 *   "picks": [
 *     {
 *       "id": "clx456",
 *       "game": {
 *         "id": "clx123",
 *         "homeTeam": "Lakers",
 *         "awayTeam": "Celtics",
 *         "startTime": "2024-12-24T02:00:00.000Z",
 *         "status": "SCHEDULED"
 *       },
 *       "market": "SPREAD",
 *       "side": "HOME",
 *       "odds": -110,
 *       "line": -3.5,
 *       "units": 1.0,
 *       "result": "PENDING",
 *       "pickedAt": "2024-12-23T20:00:00.000Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 45,
 *     "pages": 3
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = (await requireAuth()) as any;

    const { searchParams } = new URL(request.url);
    const query = GetPicksQuerySchema.parse({
      status: searchParams.get("status"),
      league: searchParams.get("league"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    // Build where clause
    const where: any = { userId: user.id };

    if (query.status) {
      where.result = query.status;
    }

    if (query.league) {
      where.game = {
        league: { abbr: query.league },
      };
    }

    // Get total count
    const total = await prisma.userPick.count({ where });

    // Get picks
    const picks = await prisma.userPick.findMany({
      where,
      include: {
        game: {
          include: {
            league: { select: { abbr: true } },
            homeTeam: { select: { abbr: true } },
            awayTeam: { select: { abbr: true } },
          },
        },
        market: { select: { type: true } },
      },
      orderBy: { pickedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return NextResponse.json({
      picks: picks.map((pick) => ({
        id: pick.id,
        game: {
          id: pick.game.id,
          league: pick.game.league.abbr,
          homeTeam: pick.game.homeTeam.abbr,
          awayTeam: pick.game.awayTeam.abbr,
          startTime: pick.game.startTime,
          status: pick.game.status,
        },
        market: pick.market.type,
        side: pick.side,
        odds: pick.odds,
        line: pick.line,
        units: pick.units,
        result: pick.result,
        notes: pick.notes,
        pickedAt: pick.pickedAt,
        settledAt: pick.settledAt,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
