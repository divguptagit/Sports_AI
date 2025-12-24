"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface OddsDataPoint {
  timestamp: string;
  bookmaker: string;
  market: string;
  homeOdds: number | null;
  awayOdds: number | null;
  overOdds: number | null;
  underOdds: number | null;
  line: number | null;
}

interface OddsMovementChartProps {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
}

type MarketType = "MONEYLINE" | "SPREAD" | "TOTAL";
type ViewMode = "bookmaker" | "best";

export default function OddsMovementChart({
  gameId,
  homeTeam,
  awayTeam,
}: OddsMovementChartProps) {
  const [oddsHistory, setOddsHistory] = useState<OddsDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<MarketType>("SPREAD");
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("best");
  const [hours, setHours] = useState(24);

  useEffect(() => {
    fetchOddsHistory();
  }, [gameId, selectedMarket, selectedBookmaker, hours]);

  async function fetchOddsHistory() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        market: selectedMarket,
        hours: hours.toString(),
      });

      if (selectedBookmaker !== "all") {
        params.set("bookmaker", selectedBookmaker);
      }

      const response = await fetch(
        `/api/game/${gameId}/odds/history?${params.toString()}`
      );
      const data = await response.json();
      setOddsHistory(data.history || []);
    } catch (error) {
      console.error("Failed to fetch odds history:", error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique bookmakers
  const bookmakers = useMemo(() => {
    const unique = new Set(oddsHistory.map((d) => d.bookmaker));
    return Array.from(unique).sort();
  }, [oddsHistory]);

  // Process data for chart
  const chartData = useMemo(() => {
    if (oddsHistory.length === 0) return [];

    // Group by timestamp
    const grouped = new Map<string, Map<string, OddsDataPoint>>();

    for (const point of oddsHistory) {
      if (!grouped.has(point.timestamp)) {
        grouped.set(point.timestamp, new Map());
      }
      grouped.get(point.timestamp)!.set(point.bookmaker, point);
    }

    // Convert to chart format
    const result = Array.from(grouped.entries()).map(([timestamp, bookmakerData]) => {
      const entry: any = {
        timestamp,
        time: new Date(timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      if (viewMode === "best") {
        // Calculate best line (most favorable odds)
        let bestHomeOdds: number | null = null;
        let bestAwayOdds: number | null = null;
        let bestOverOdds: number | null = null;
        let bestUnderOdds: number | null = null;
        let avgLine: number | null = null;

        const lines: number[] = [];

        for (const point of bookmakerData.values()) {
          if (selectedMarket === "MONEYLINE" || selectedMarket === "SPREAD") {
            if (point.homeOdds !== null) {
              bestHomeOdds =
                bestHomeOdds === null
                  ? point.homeOdds
                  : Math.max(bestHomeOdds, point.homeOdds);
            }
            if (point.awayOdds !== null) {
              bestAwayOdds =
                bestAwayOdds === null
                  ? point.awayOdds
                  : Math.max(bestAwayOdds, point.awayOdds);
            }
          }

          if (selectedMarket === "TOTAL") {
            if (point.overOdds !== null) {
              bestOverOdds =
                bestOverOdds === null
                  ? point.overOdds
                  : Math.max(bestOverOdds, point.overOdds);
            }
            if (point.underOdds !== null) {
              bestUnderOdds =
                bestUnderOdds === null
                  ? point.underOdds
                  : Math.max(bestUnderOdds, point.underOdds);
            }
          }

          if (point.line !== null) {
            lines.push(point.line);
          }
        }

        if (lines.length > 0) {
          avgLine = lines.reduce((a, b) => a + b, 0) / lines.length;
        }

        entry.homeOdds = bestHomeOdds;
        entry.awayOdds = bestAwayOdds;
        entry.overOdds = bestOverOdds;
        entry.underOdds = bestUnderOdds;
        entry.line = avgLine;
      } else {
        // Show specific bookmaker
        const data = bookmakerData.get(selectedBookmaker);
        if (data) {
          entry.homeOdds = data.homeOdds;
          entry.awayOdds = data.awayOdds;
          entry.overOdds = data.overOdds;
          entry.underOdds = data.underOdds;
          entry.line = data.line;
        }
      }

      return entry;
    });

    return result.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [oddsHistory, viewMode, selectedBookmaker, selectedMarket]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {new Date(data.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        {selectedMarket === "MONEYLINE" && (
          <>
            {data.awayOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {awayTeam}: <span className="font-mono font-medium">{formatOdds(data.awayOdds)}</span>
              </p>
            )}
            {data.homeOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {homeTeam}: <span className="font-mono font-medium">{formatOdds(data.homeOdds)}</span>
              </p>
            )}
          </>
        )}

        {selectedMarket === "SPREAD" && (
          <>
            {data.line !== null && (
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                Line: <span className="font-mono font-medium">{formatOdds(data.line)}</span>
              </p>
            )}
            {data.awayOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {awayTeam}: <span className="font-mono font-medium">{formatOdds(data.awayOdds)}</span>
              </p>
            )}
            {data.homeOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {homeTeam}: <span className="font-mono font-medium">{formatOdds(data.homeOdds)}</span>
              </p>
            )}
          </>
        )}

        {selectedMarket === "TOTAL" && (
          <>
            {data.line !== null && (
              <p className="mb-1 text-sm text-gray-700 dark:text-gray-300">
                Line: <span className="font-mono font-medium">{data.line.toFixed(1)}</span>
              </p>
            )}
            {data.overOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Over: <span className="font-mono font-medium">{formatOdds(data.overOdds)}</span>
              </p>
            )}
            {data.underOdds !== null && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Under: <span className="font-mono font-medium">{formatOdds(data.underOdds)}</span>
              </p>
            )}
          </>
        )}

        {viewMode === "best" && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Best available line
          </p>
        )}
      </div>
    );
  };

  function formatOdds(odds: number) {
    return odds > 0 ? `+${odds}` : odds.toString();
  }

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          No odds history available for this game
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        {/* Market Selector */}
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Market
          </label>
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value as MarketType)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="MONEYLINE">Moneyline</option>
            <option value="SPREAD">Spread</option>
            <option value="TOTAL">Total</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            View
          </label>
          <select
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value as ViewMode);
              if (e.target.value === "bookmaker" && selectedBookmaker === "all") {
                setSelectedBookmaker(bookmakers[0] || "all");
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="best">Best Line</option>
            <option value="bookmaker">Specific Bookmaker</option>
          </select>
        </div>

        {/* Bookmaker Selector */}
        {viewMode === "bookmaker" && (
          <div className="flex-1 min-w-[150px]">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bookmaker
            </label>
            <select
              value={selectedBookmaker}
              onChange={(e) => setSelectedBookmaker(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {bookmakers.map((bm) => (
                <option key={bm} value={bm}>
                  {bm}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Time Range */}
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Range
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="6">Last 6 hours</option>
            <option value="12">Last 12 hours</option>
            <option value="24">Last 24 hours</option>
            <option value="48">Last 48 hours</option>
            <option value="72">Last 72 hours</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#6B7280" }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#6B7280" }}
              tickFormatter={(value) => (selectedMarket === "TOTAL" ? value.toFixed(1) : formatOdds(value))}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              iconType="line"
            />

            {(selectedMarket === "MONEYLINE" || selectedMarket === "SPREAD") && (
              <>
                <Line
                  type="monotone"
                  dataKey="awayOdds"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={awayTeam}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="homeOdds"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={homeTeam}
                  connectNulls
                />
                {selectedMarket === "SPREAD" && (
                  <Line
                    type="monotone"
                    dataKey="line"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Line"
                    connectNulls
                  />
                )}
              </>
            )}

            {selectedMarket === "TOTAL" && (
              <>
                <Line
                  type="monotone"
                  dataKey="overOdds"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Over"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="underOdds"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Under"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="line"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name="Line"
                  connectNulls
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Data Points Count */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Showing {chartData.length} data point{chartData.length !== 1 ? "s" : ""} over last {hours} hours
        </p>
      </div>
    </div>
  );
}

