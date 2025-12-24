import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import OddsMovementChart from "@/components/charts/OddsMovementChart";

// Mock fetch
global.fetch = vi.fn();

describe("OddsMovementChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOddsHistory = {
    gameId: "test-game-123",
    market: "SPREAD",
    bookmaker: "all",
    history: [
      {
        timestamp: "2024-12-24T10:00:00.000Z",
        bookmaker: "draftkings",
        market: "SPREAD",
        homeOdds: -110,
        awayOdds: -110,
        line: -3.0,
      },
      {
        timestamp: "2024-12-24T11:00:00.000Z",
        bookmaker: "draftkings",
        market: "SPREAD",
        homeOdds: -110,
        awayOdds: -110,
        line: -3.5,
      },
      {
        timestamp: "2024-12-24T12:00:00.000Z",
        bookmaker: "fanduel",
        market: "SPREAD",
        homeOdds: -105,
        awayOdds: -115,
        line: -3.5,
      },
    ],
    count: 3,
  };

  it("should render loading state initially", () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    // Should show loading animation
    expect(document.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("should fetch and render odds history", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/game/test-game-123/odds/history")
      );
    });

    // Should render chart controls
    await waitFor(() => {
      expect(screen.getByText("Market")).toBeTruthy();
      expect(screen.getByText("Bookmaker")).toBeTruthy();
    });
  });

  it("should render empty state when no data", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => ({ history: [], count: 0 }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No odds history available for this market")
      ).toBeTruthy();
    });
  });

  it("should handle age verification required", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 403,
      json: async () => ({
        error: { code: "AGE_VERIFICATION_REQUIRED" },
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No odds history available for this market")
      ).toBeTruthy();
    });
  });

  it("should render SVG chart with data", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    const { container } = render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
    });

    // Should have polylines for home and away odds
    await waitFor(() => {
      const polylines = container.querySelectorAll("polyline");
      expect(polylines.length).toBeGreaterThan(0);
    });
  });

  it("should render legend with team names", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("LAL")).toBeTruthy();
      expect(screen.getByText("BOS")).toBeTruthy();
    });
  });

  it("should have market selector with options", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    const { container } = render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      const selects = container.querySelectorAll("select");
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    // Should have market options
    await waitFor(() => {
      expect(screen.getByText("Moneyline")).toBeTruthy();
      expect(screen.getByText("Spread")).toBeTruthy();
      expect(screen.getByText("Total")).toBeTruthy();
    });
  });

  it("should have bookmaker selector with best line option", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Best Line")).toBeTruthy();
    });
  });

  it("should render interactive points", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockOddsHistory,
    });

    const { container } = render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBeGreaterThan(0);
    });

    // Circles should have hover class
    await waitFor(() => {
      const circles = container.querySelectorAll("circle");
      const firstCircle = circles[0];
      expect(firstCircle?.classList.contains("cursor-pointer")).toBe(true);
    });
  });

  it("should handle sparse data gracefully", async () => {
    const sparseData = {
      history: [
        {
          timestamp: "2024-12-24T10:00:00.000Z",
          bookmaker: "draftkings",
          market: "SPREAD",
          homeOdds: -110,
          awayOdds: null, // Missing away odds
          line: -3.0,
        },
      ],
      count: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => sparseData,
    });

    const { container } = render(
      <OddsMovementChart
        gameId="test-game-123"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    // Should still render without crashing
    await waitFor(() => {
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
    });
  });
});

