import { describe, it, expect } from "vitest";
import {
  generateBaselinePrediction,
  findBestOdds,
  calculateConsensus,
} from "@/lib/analytics/baseline";

describe("Baseline Prediction", () => {
  describe("generateBaselinePrediction", () => {
    it("should generate predictions for both sides", () => {
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: new Date(),
      };

      const result = generateBaselinePrediction(odds);

      expect(result.home).toBeDefined();
      expect(result.away).toBeDefined();
      expect(result.home.side).toBe("HOME");
      expect(result.away.side).toBe("AWAY");
    });

    it("should normalize probabilities to sum to 1", () => {
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: new Date(),
      };

      const result = generateBaselinePrediction(odds);

      expect(result.home.modelProbability + result.away.modelProbability).toBeCloseTo(
        1.0,
        10
      );
    });

    it("should calculate vig correctly", () => {
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: new Date(),
      };

      const result = generateBaselinePrediction(odds);

      expect(result.home.vig).toBeGreaterThan(0);
      expect(result.home.vig).toBe(result.away.vig); // Same vig for both
    });

    it("should set correct source", () => {
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: new Date(),
      };

      const result = generateBaselinePrediction(odds);

      expect(result.home.source).toBe("baseline-market-derived");
      expect(result.away.source).toBe("baseline-market-derived");
    });

    it("should calculate edge relative to raw implied probability", () => {
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: new Date(),
      };

      const result = generateBaselinePrediction(odds);

      // Normalized prob should be slightly higher than implied
      expect(result.home.modelProbability).toBeGreaterThan(
        result.home.impliedProbability
      );
      expect(result.home.edge).toBeGreaterThan(0);
    });

    it("should handle stale data", () => {
      const oldTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const odds = {
        homeOdds: -110,
        awayOdds: -110,
        timestamp: oldTimestamp,
      };

      const result = generateBaselinePrediction(odds);

      expect(result.home.dataFreshness).toBeGreaterThan(100); // Minutes
    });
  });

  describe("findBestOdds", () => {
    const bookmakers = [
      { name: "DraftKings", homeOdds: -110, awayOdds: 100 },
      { name: "FanDuel", homeOdds: -105, awayOdds: 105 }, // Better home odds
      { name: "BetMGM", homeOdds: -115, awayOdds: 95 },
    ];

    it("should find best home odds", () => {
      const result = findBestOdds(bookmakers);

      expect(result.home.bookmaker).toBe("FanDuel");
      expect(result.home.odds).toBe(-105);
    });

    it("should find best away odds", () => {
      const result = findBestOdds(bookmakers);

      expect(result.away.bookmaker).toBe("FanDuel");
      expect(result.away.odds).toBe(105);
    });

    it("should handle underdog odds", () => {
      const books = [
        { name: "Book1", homeOdds: 150, awayOdds: -170 },
        { name: "Book2", homeOdds: 160, awayOdds: -165 }, // Better home odds
        { name: "Book3", homeOdds: 140, awayOdds: -160 },
      ];

      const result = findBestOdds(books);

      expect(result.home.bookmaker).toBe("Book2");
      expect(result.home.odds).toBe(160);
    });

    it("should prefer less negative favorite odds", () => {
      const books = [
        { name: "Book1", homeOdds: -110, awayOdds: 100 },
        { name: "Book2", homeOdds: -105, awayOdds: 95 }, // Better (closer to 0)
        { name: "Book3", homeOdds: -115, awayOdds: 105 },
      ];

      const result = findBestOdds(books);

      expect(result.home.bookmaker).toBe("Book2");
      expect(result.home.odds).toBe(-105);
    });
  });

  describe("calculateConsensus", () => {
    it("should calculate average normalized probabilities", () => {
      const bookmakers = [
        { homeOdds: -110, awayOdds: -110 },
        { homeOdds: -105, awayOdds: -115 },
        { homeOdds: -115, awayOdds: -105 },
      ];

      const result = calculateConsensus(bookmakers);

      expect(result.homeProb + result.awayProb).toBeCloseTo(1.0, 10);
      expect(result.homeProb).toBeCloseTo(0.5, 2); // Should be near 50%
    });

    it("should calculate average vig", () => {
      const bookmakers = [
        { homeOdds: -110, awayOdds: -110 },
        { homeOdds: -110, awayOdds: -110 },
      ];

      const result = calculateConsensus(bookmakers);

      expect(result.avgVig).toBeGreaterThan(0);
    });

    it("should handle empty array", () => {
      const result = calculateConsensus([]);

      expect(result.homeProb).toBe(0.5);
      expect(result.awayProb).toBe(0.5);
      expect(result.avgVig).toBe(0);
    });

    it("should weight all bookmakers equally", () => {
      const bookmakers = [
        { homeOdds: -200, awayOdds: 170 }, // Heavily favors home
        { homeOdds: 170, awayOdds: -200 }, // Heavily favors away
      ];

      const result = calculateConsensus(bookmakers);

      // Should average out to near 50/50
      expect(result.homeProb).toBeCloseTo(0.5, 1);
      expect(result.awayProb).toBeCloseTo(0.5, 1);
    });
  });
});

