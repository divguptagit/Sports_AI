import { describe, it, expect } from "vitest";
import {
  americanToImpliedProb,
  impliedProbToAmerican,
  americanToDecimal,
  removeVig,
  calculateEdge,
  calculateEV,
  getConfidenceTier,
  formatOdds,
  formatProbability,
} from "@/lib/analytics/odds";

describe("Odds Conversion", () => {
  describe("americanToImpliedProb", () => {
    it("should convert favorite odds correctly", () => {
      expect(americanToImpliedProb(-110)).toBeCloseTo(0.5238, 4);
      expect(americanToImpliedProb(-200)).toBeCloseTo(0.6667, 4);
      expect(americanToImpliedProb(-150)).toBeCloseTo(0.6, 4);
    });

    it("should convert underdog odds correctly", () => {
      expect(americanToImpliedProb(150)).toBeCloseTo(0.4, 4);
      expect(americanToImpliedProb(200)).toBeCloseTo(0.3333, 4);
      expect(americanToImpliedProb(100)).toBeCloseTo(0.5, 4);
    });

    it("should handle edge cases", () => {
      expect(americanToImpliedProb(0)).toBe(0);
      expect(americanToImpliedProb(-100)).toBeCloseTo(0.5, 4);
    });
  });

  describe("impliedProbToAmerican", () => {
    it("should convert to favorite odds when prob >= 0.5", () => {
      expect(impliedProbToAmerican(0.6)).toBeCloseTo(-150, 0);
      expect(impliedProbToAmerican(0.5238)).toBeCloseTo(-110, 0);
      expect(impliedProbToAmerican(0.5)).toBe(-100);
    });

    it("should convert to underdog odds when prob < 0.5", () => {
      expect(impliedProbToAmerican(0.4)).toBeCloseTo(150, 0);
      expect(impliedProbToAmerican(0.3333)).toBeCloseTo(200, 0);
    });

    it("should handle edge cases", () => {
      expect(impliedProbToAmerican(0)).toBe(0);
      expect(impliedProbToAmerican(1)).toBe(0);
    });

    it("should round-trip correctly", () => {
      const odds = -110;
      const prob = americanToImpliedProb(odds);
      const backToOdds = impliedProbToAmerican(prob);
      expect(backToOdds).toBeCloseTo(odds, 0);
    });
  });

  describe("americanToDecimal", () => {
    it("should convert favorite odds correctly", () => {
      expect(americanToDecimal(-110)).toBeCloseTo(1.909, 2);
      expect(americanToDecimal(-200)).toBeCloseTo(1.5, 2);
    });

    it("should convert underdog odds correctly", () => {
      expect(americanToDecimal(150)).toBeCloseTo(2.5, 2);
      expect(americanToDecimal(200)).toBeCloseTo(3.0, 2);
    });

    it("should handle even odds", () => {
      expect(americanToDecimal(100)).toBe(2.0);
      expect(americanToDecimal(-100)).toBe(2.0);
    });
  });

  describe("removeVig", () => {
    it("should normalize two-way market odds", () => {
      const { homeProb, awayProb, vig } = removeVig(-110, -110);

      expect(homeProb + awayProb).toBeCloseTo(1.0, 10);
      expect(homeProb).toBeCloseTo(0.5, 4);
      expect(awayProb).toBeCloseTo(0.5, 4);
      expect(vig).toBeGreaterThan(0); // Bookmaker's edge
    });

    it("should handle different odds", () => {
      const { homeProb, awayProb, vig } = removeVig(-150, 130);

      expect(homeProb + awayProb).toBeCloseTo(1.0, 10);
      expect(homeProb).toBeGreaterThan(awayProb);
      expect(vig).toBeGreaterThan(0);
    });

    it("should calculate vig correctly", () => {
      const { vig } = removeVig(-110, -110);
      
      // -110 has implied prob of ~52.38%, so total is ~104.76%
      // Vig should be ~4.76%
      expect(vig).toBeCloseTo(0.0476, 3);
    });
  });

  describe("calculateEdge", () => {
    it("should calculate positive edge", () => {
      const modelProb = 0.55;
      const marketOdds = -110; // ~52.38% implied
      const edge = calculateEdge(modelProb, marketOdds);

      expect(edge).toBeGreaterThan(0);
      expect(edge).toBeCloseTo(2.62, 1);
    });

    it("should calculate negative edge", () => {
      const modelProb = 0.50;
      const marketOdds = -110; // ~52.38% implied
      const edge = calculateEdge(modelProb, marketOdds);

      expect(edge).toBeLessThan(0);
      expect(edge).toBeCloseTo(-2.38, 1);
    });

    it("should return zero edge when model matches market", () => {
      const odds = -110;
      const impliedProb = americanToImpliedProb(odds);
      const edge = calculateEdge(impliedProb, odds);

      expect(edge).toBeCloseTo(0, 10);
    });
  });

  describe("calculateEV", () => {
    it("should calculate positive EV", () => {
      const modelProb = 0.55;
      const odds = 100; // Even odds, 2.0 decimal
      const ev = calculateEV(modelProb, odds, 1);

      expect(ev).toBeGreaterThan(0);
      expect(ev).toBeCloseTo(0.10, 2);
    });

    it("should calculate negative EV", () => {
      const modelProb = 0.45;
      const odds = 100;
      const ev = calculateEV(modelProb, odds, 1);

      expect(ev).toBeLessThan(0);
      expect(ev).toBeCloseTo(-0.10, 2);
    });

    it("should scale with stake", () => {
      const modelProb = 0.55;
      const odds = 100;
      const ev1 = calculateEV(modelProb, odds, 1);
      const ev10 = calculateEV(modelProb, odds, 10);

      expect(ev10).toBeCloseTo(ev1 * 10, 2);
    });
  });

  describe("getConfidenceTier", () => {
    it("should return high confidence for large edge", () => {
      expect(getConfidenceTier(5.5, 0)).toBe("high");
      expect(getConfidenceTier(10, 0)).toBe("high");
    });

    it("should return medium confidence for moderate edge", () => {
      expect(getConfidenceTier(3, 0)).toBe("medium");
      expect(getConfidenceTier(4.5, 0)).toBe("medium");
    });

    it("should return low confidence for small edge", () => {
      expect(getConfidenceTier(1.5, 0)).toBe("low");
      expect(getConfidenceTier(2, 0)).toBe("low");
    });

    it("should return none for very small edge", () => {
      expect(getConfidenceTier(0.5, 0)).toBe("none");
      expect(getConfidenceTier(0, 0)).toBe("none");
    });

    it("should penalize stale data", () => {
      expect(getConfidenceTier(6, 0)).toBe("high");
      expect(getConfidenceTier(6, 120)).toBe("medium"); // Stale data
    });
  });

  describe("Formatting Functions", () => {
    describe("formatOdds", () => {
      it("should format positive odds with plus sign", () => {
        expect(formatOdds(150)).toBe("+150");
        expect(formatOdds(100)).toBe("+100");
      });

      it("should format negative odds correctly", () => {
        expect(formatOdds(-110)).toBe("-110");
        expect(formatOdds(-200)).toBe("-200");
      });

      it("should handle zero", () => {
        expect(formatOdds(0)).toBe("N/A");
      });
    });

    describe("formatProbability", () => {
      it("should format as percentage", () => {
        expect(formatProbability(0.5238, 1)).toBe("52.4%");
        expect(formatProbability(0.6, 1)).toBe("60.0%");
      });

      it("should respect decimal places", () => {
        expect(formatProbability(0.5238, 2)).toBe("52.38%");
        expect(formatProbability(0.5238, 0)).toBe("52%");
      });
    });
  });
});

