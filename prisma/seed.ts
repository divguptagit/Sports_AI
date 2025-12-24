import { PrismaClient, GameStatus, MarketType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (optional - comment out if you want to keep data)
  console.log("🧹 Cleaning existing data...");
  await prisma.oddsSnapshot.deleteMany();
  await prisma.userPick.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.game.deleteMany();
  await prisma.team.deleteMany();
  await prisma.market.deleteMany();
  await prisma.bookmaker.deleteMany();
  await prisma.league.deleteMany();

  // Create Leagues
  console.log("🏈 Creating leagues...");
  const nfl = await prisma.league.create({
    data: {
      name: "National Football League",
      abbr: "NFL",
      active: true,
    },
  });

  const nba = await prisma.league.create({
    data: {
      name: "National Basketball Association",
      abbr: "NBA",
      active: true,
    },
  });

  // Create NFL Teams
  console.log("🏈 Creating NFL teams...");
  const chiefs = await prisma.team.create({
    data: {
      leagueId: nfl.id,
      name: "Kansas City Chiefs",
      abbr: "KC",
      city: "Kansas City",
      primaryColor: "#E31837",
      active: true,
    },
  });

  const bills = await prisma.team.create({
    data: {
      leagueId: nfl.id,
      name: "Buffalo Bills",
      abbr: "BUF",
      city: "Buffalo",
      primaryColor: "#00338D",
      active: true,
    },
  });

  const fortyNiners = await prisma.team.create({
    data: {
      leagueId: nfl.id,
      name: "San Francisco 49ers",
      abbr: "SF",
      city: "San Francisco",
      primaryColor: "#AA0000",
      active: true,
    },
  });

  const eagles = await prisma.team.create({
    data: {
      leagueId: nfl.id,
      name: "Philadelphia Eagles",
      abbr: "PHI",
      city: "Philadelphia",
      primaryColor: "#004C54",
      active: true,
    },
  });

  // Create NBA Teams
  console.log("🏀 Creating NBA teams...");
  const lakers = await prisma.team.create({
    data: {
      leagueId: nba.id,
      name: "Los Angeles Lakers",
      abbr: "LAL",
      city: "Los Angeles",
      primaryColor: "#552583",
      active: true,
    },
  });

  const celtics = await prisma.team.create({
    data: {
      leagueId: nba.id,
      name: "Boston Celtics",
      abbr: "BOS",
      city: "Boston",
      primaryColor: "#007A33",
      active: true,
    },
  });

  const warriors = await prisma.team.create({
    data: {
      leagueId: nba.id,
      name: "Golden State Warriors",
      abbr: "GSW",
      city: "Golden State",
      primaryColor: "#1D428A",
      active: true,
    },
  });

  const bucks = await prisma.team.create({
    data: {
      leagueId: nba.id,
      name: "Milwaukee Bucks",
      abbr: "MIL",
      city: "Milwaukee",
      primaryColor: "#00471B",
      active: true,
    },
  });

  // Create Bookmakers
  console.log("💰 Creating bookmakers...");
  const draftkings = await prisma.bookmaker.create({
    data: {
      name: "draftkings",
      displayName: "DraftKings Sportsbook",
      active: true,
    },
  });

  const fanduel = await prisma.bookmaker.create({
    data: {
      name: "fanduel",
      displayName: "FanDuel Sportsbook",
      active: true,
    },
  });

  const betmgm = await prisma.bookmaker.create({
    data: {
      name: "betmgm",
      displayName: "BetMGM",
      active: true,
    },
  });

  // Create Markets
  console.log("📊 Creating markets...");
  const moneylineMarket = await prisma.market.create({
    data: {
      type: MarketType.MONEYLINE,
      name: "Moneyline",
      description: "Pick the winner of the game",
    },
  });

  const spreadMarket = await prisma.market.create({
    data: {
      type: MarketType.SPREAD,
      name: "Point Spread",
      description: "Pick a team to cover the spread",
    },
  });

  const totalMarket = await prisma.market.create({
    data: {
      type: MarketType.TOTAL,
      name: "Total Points",
      description: "Pick over or under the total",
    },
  });

  // Create Sample Games
  console.log("🎮 Creating sample games...");

  // NFL Game 1 - Tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(20, 0, 0, 0); // 8 PM

  const nflGame1 = await prisma.game.create({
    data: {
      leagueId: nfl.id,
      homeTeamId: chiefs.id,
      awayTeamId: bills.id,
      startTime: tomorrow,
      status: GameStatus.SCHEDULED,
      venue: "Arrowhead Stadium",
      externalId: "nfl-2024-001",
    },
  });

  // NFL Game 2 - Tomorrow
  const tomorrow2 = new Date(tomorrow);
  tomorrow2.setHours(16, 30, 0, 0); // 4:30 PM

  const nflGame2 = await prisma.game.create({
    data: {
      leagueId: nfl.id,
      homeTeamId: eagles.id,
      awayTeamId: fortyNiners.id,
      startTime: tomorrow2,
      status: GameStatus.SCHEDULED,
      venue: "Lincoln Financial Field",
      externalId: "nfl-2024-002",
    },
  });

  // NBA Game - Tonight
  const tonight = new Date();
  tonight.setHours(22, 0, 0, 0); // 10 PM

  const nbaGame1 = await prisma.game.create({
    data: {
      leagueId: nba.id,
      homeTeamId: lakers.id,
      awayTeamId: celtics.id,
      startTime: tonight,
      status: GameStatus.SCHEDULED,
      venue: "Crypto.com Arena",
      externalId: "nba-2024-001",
    },
  });

  // NBA Game 2 - Tomorrow
  const tomorrow3 = new Date(tomorrow);
  tomorrow3.setHours(19, 30, 0, 0); // 7:30 PM

  const nbaGame2 = await prisma.game.create({
    data: {
      leagueId: nba.id,
      homeTeamId: bucks.id,
      awayTeamId: warriors.id,
      startTime: tomorrow3,
      status: GameStatus.SCHEDULED,
      venue: "Fiserv Forum",
      externalId: "nba-2024-002",
    },
  });

  // Create Sample Odds for NFL Game 1
  console.log("📈 Creating sample odds...");

  // Moneyline odds - DraftKings
  await prisma.oddsSnapshot.create({
    data: {
      gameId: nflGame1.id,
      bookmakerId: draftkings.id,
      marketId: moneylineMarket.id,
      homeOdds: -150, // Chiefs favored
      awayOdds: 130,
      timestamp: new Date(),
    },
  });

  // Moneyline odds - FanDuel
  await prisma.oddsSnapshot.create({
    data: {
      gameId: nflGame1.id,
      bookmakerId: fanduel.id,
      marketId: moneylineMarket.id,
      homeOdds: -145,
      awayOdds: 125,
      timestamp: new Date(),
    },
  });

  // Spread odds - DraftKings
  await prisma.oddsSnapshot.create({
    data: {
      gameId: nflGame1.id,
      bookmakerId: draftkings.id,
      marketId: spreadMarket.id,
      homeOdds: -110,
      awayOdds: -110,
      line: -3.5, // Chiefs -3.5
      timestamp: new Date(),
    },
  });

  // Total odds - DraftKings
  await prisma.oddsSnapshot.create({
    data: {
      gameId: nflGame1.id,
      bookmakerId: draftkings.id,
      marketId: totalMarket.id,
      overOdds: -110,
      underOdds: -110,
      line: 50.5, // O/U 50.5
      timestamp: new Date(),
    },
  });

  // Create Sample Odds for NBA Game 1
  await prisma.oddsSnapshot.create({
    data: {
      gameId: nbaGame1.id,
      bookmakerId: draftkings.id,
      marketId: moneylineMarket.id,
      homeOdds: -120,
      awayOdds: 100,
      timestamp: new Date(),
    },
  });

  await prisma.oddsSnapshot.create({
    data: {
      gameId: nbaGame1.id,
      bookmakerId: draftkings.id,
      marketId: spreadMarket.id,
      homeOdds: -110,
      awayOdds: -110,
      line: -2.5,
      timestamp: new Date(),
    },
  });

  await prisma.oddsSnapshot.create({
    data: {
      gameId: nbaGame1.id,
      bookmakerId: draftkings.id,
      marketId: totalMarket.id,
      overOdds: -110,
      underOdds: -110,
      line: 225.5,
      timestamp: new Date(),
    },
  });

  // Create historical odds (simulate odds movement)
  console.log("📊 Creating odds history...");
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  await prisma.oddsSnapshot.create({
    data: {
      gameId: nflGame1.id,
      bookmakerId: draftkings.id,
      marketId: spreadMarket.id,
      homeOdds: -110,
      awayOdds: -110,
      line: -3.0, // Line moved from -3 to -3.5
      timestamp: oneHourAgo,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`
    Created:
    - 2 Leagues (NFL, NBA)
    - 8 Teams (4 NFL, 4 NBA)
    - 3 Bookmakers
    - 3 Markets
    - 4 Games
    - 9 Odds Snapshots
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

