import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import OddsMovementChart from "@/components/charts/OddsMovementChart";

// Mock fetch
global.fetch = vi.fn();

// Mock recharts to avoid canvas/SVG issues in tests
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: ({ name }: any) => <div data-testid={`line-${name}`}>{name}</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="grid">Grid</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
}));

describe("OddsMovementChart", () => {
  const mockOddsHistory = [
    {
      timestamp: "2024-12-24T10:00:00.000Z",
      bookmaker: "draftkings",
      market: "SPREAD",
      homeOdds: -110,
      awayOdds: -110,
      overOdds: null,
      underOdds: null,
      line: -3.5,
    },
    {
      timestamp: "2024-12-24T11:00:00.000Z",
      bookmaker: "draftkings",
      market: "SPREAD",
      homeOdds: -110,
      awayOdds: -110,
      overOdds: null,
      underOdds: null,
      line: -3.0,
    },
    {
      timestamp: "2024-12-24T12:00:00.000Z",
      bookmaker: "fanduel",
      market: "SPREAD",
      homeOdds: -115,
      awayOdds: -105,
      overOdds: null,
      underOdds: null,
      line: -3.5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render chart with mocked data", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: mockOddsHistory,
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    // Should show loading state initially
    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    // Verify chart components are rendered
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("grid")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
  });

  it("should render chart controls", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: mockOddsHistory,
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    // Check for control labels
    expect(screen.getByText("Market")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Time Range")).toBeInTheDocument();

    // Check for select elements
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThanOrEqual(3);
  });

  it("should show empty state when no data", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: [],
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No odds history available for this game")
      ).toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    (global.fetch as any).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No odds history available for this game")
      ).toBeInTheDocument();
    });
  });

  it("should show data points count", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: mockOddsHistory,
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Showing \d+ data point/i)
      ).toBeInTheDocument();
    });
  });

  it("should render lines for spread market", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: mockOddsHistory,
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      // Should render lines for both teams and the spread line
      expect(screen.getByTestId("line-BOS")).toBeInTheDocument();
      expect(screen.getByTestId("line-LAL")).toBeInTheDocument();
      expect(screen.getByTestId("line-Line")).toBeInTheDocument();
    });
  });

  it("should handle sparse data with connectNulls", async () => {
    const sparseData = [
      {
        timestamp: "2024-12-24T10:00:00.000Z",
        bookmaker: "draftkings",
        market: "SPREAD",
        homeOdds: -110,
        awayOdds: null, // Missing data
        overOdds: null,
        underOdds: null,
        line: -3.5,
      },
      {
        timestamp: "2024-12-24T12:00:00.000Z",
        bookmaker: "draftkings",
        market: "SPREAD",
        homeOdds: -110,
        awayOdds: -110,
        overOdds: null,
        underOdds: null,
        line: -3.0,
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        history: sparseData,
      }),
    });

    render(
      <OddsMovementChart
        gameId="test-game-id"
        homeTeam="LAL"
        awayTeam="BOS"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    // Should still render chart despite sparse data
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});

