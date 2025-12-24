import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("GET /api/slate", () => {
  let testLeagueId: string;
  let testTeam1Id: string;
  let testTeam2Id: string;
  let testGameId: string;

  beforeAll(async () => {
    // Create test data
    const league = await prisma.league.create({
      data: {
        name: "Test League",
        abbr: "TEST",
        active: true,
      },
    });
    testLeagueId = league.id;

    const team1 = await prisma.team.create({
      data: {
        leagueId: testLeagueId,
        name: "Test Team 1",
        abbr: "TT1",
        city: "Test City 1",
      },
    });
    testTeam1Id = team1.id;

    const team2 = await prisma.team.create({
      data: {
        leagueId: testLeagueId,
        name: "Test Team 2",
        abbr: "TT2",
        city: "Test City 2",
      },
    });
    testTeam2Id = team2.id;

    // Create a game for today
    const today = new Date();
    today.setHours(20, 0, 0, 0);

    const game = await prisma.game.create({
      data: {
        leagueId: testLeagueId,
        homeTeamId: testTeam1Id,
        awayTeamId: testTeam2Id,
        startTime: today,
        status: "SCHEDULED",
        venue: "Test Arena",
      },
    });
    testGameId = game.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.game.delete({ where: { id: testGameId } });
    await prisma.team.delete({ where: { id: testTeam1Id } });
    await prisma.team.delete({ where: { id: testTeam2Id } });
    await prisma.league.delete({ where: { id: testLeagueId } });
    await prisma.$disconnect();
  });

  it("should return today's slate of games", async () => {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `http://localhost:3000/api/slate?date=${today}`
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("games");
    expect(data).toHaveProperty("count");
    expect(data).toHaveProperty("date");
    expect(Array.isArray(data.games)).toBe(true);
  });

  it("should filter by league", async () => {
    const response = await fetch(
      "http://localhost:3000/api/slate?league=TEST"
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.games.every((game: any) => game.league === "TEST")).toBe(true);
  });

  it("should return empty array for date with no games", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const dateStr = futureDate.toISOString().split("T")[0];

    const response = await fetch(
      `http://localhost:3000/api/slate?date=${dateStr}`
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.games).toEqual([]);
    expect(data.count).toBe(0);
  });

  it("should validate league enum", async () => {
    const response = await fetch(
      "http://localhost:3000/api/slate?league=INVALID"
    );

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });
});

