"use client";

import { useState, useEffect } from "react";
import { formatOdds } from "@/lib/analytics/odds";

interface OddsDataPoint {
  timestamp: string;
  homeOdds?: number;
  awayOdds?: number;
  overOdds?: number;
  underOdds?: number;
  line?: number;
  bookmaker: string;
}

interface OddsMovementChartProps {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
}

type MarketType = "MONEYLINE" | "SPREAD" | "TOTAL";

export default function OddsMovementChart({
  gameId,
  homeTeam,
  awayTeam,
}: OddsMovementChartProps) {
  const [data, setData] = useState<OddsDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState<MarketType>("SPREAD");
  const [bookmaker, setBookmaker] = useState<string>("best");
  const [bookmakers, setBookmakers] = useState<string[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    fetchOddsHistory();
  }, [gameId, market, bookmaker]);

  async function fetchOddsHistory() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        market,
        hours: "48",
      });

      if (bookmaker !== "best") {
        params.set("bookmaker", bookmaker);
      }

      const response = await fetch(
        `/api/game/${gameId}/odds/history?${params.toString()}`
      );

      if (response.status === 403) {
        setData([]);
        return;
      }

      const result = await response.json();
      setData(result.history || []);

      // Extract unique bookmakers
      const uniqueBookmakers = Array.from(
        new Set(result.history?.map((d: OddsDataPoint) => d.bookmaker) || [])
      ) as string[];
      setBookmakers(uniqueBookmakers);
    } catch (error) {
      console.error("Failed to fetch odds history:", error);
    } finally {
      setLoading(false);
    }
  }

  // Process data for chart
  function processData() {
    if (data.length === 0) return { points: [], min: 0, max: 0 };

    // If "best" bookmaker, aggregate to show best line at each timestamp
    let chartData: OddsDataPoint[] = data;

    if (bookmaker === "best") {
      const timeGroups = new Map<string, OddsDataPoint[]>();

      data.forEach((point) => {
        const time = new Date(point.timestamp).toISOString().split(":")[0]; // Group by hour
        if (!timeGroups.has(time)) {
          timeGroups.set(time, []);
        }
        timeGroups.get(time)!.push(point);
      });

      chartData = Array.from(timeGroups.entries()).map(([time, points]) => {
        // Find best odds in this time period
        let best = points[0];
        points.forEach((p) => {
          if (market === "MONEYLINE" || market === "SPREAD") {
            if ((p.homeOdds || 0) > (best.homeOdds || 0)) best = p;
          } else if (market === "TOTAL") {
            if ((p.overOdds || 0) > (best.overOdds || 0)) best = p;
          }
        });
        return best;
      });
    }

    // Extract values based on market type
    const values: number[] = [];
    chartData.forEach((point) => {
      if (market === "MONEYLINE" || market === "SPREAD") {
        if (point.homeOdds) values.push(point.homeOdds);
        if (point.awayOdds) values.push(point.awayOdds);
      } else if (market === "TOTAL") {
        if (point.overOdds) values.push(point.overOdds);
        if (point.underOdds) values.push(point.underOdds);
      }
    });

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 10;

    return {
      points: chartData,
      min: min - padding,
      max: max + padding,
    };
  }

  const { points, min, max } = processData();

  // Convert value to Y coordinate
  function valueToY(value: number, height: number): number {
    if (max === min) return height / 2;
    return height - ((value - min) / (max - min)) * height;
  }

  // Convert index to X coordinate
  function indexToX(index: number, width: number): number {
    if (points.length <= 1) return width / 2;
    return (index / (points.length - 1)) * width;
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  if (points.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          No odds history available for this market
        </p>
      </div>
    );
  }

  const chartWidth = 800;
  const chartHeight = 300;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Market selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Market
          </label>
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as MarketType)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="MONEYLINE">Moneyline</option>
            <option value="SPREAD">Spread</option>
            <option value="TOTAL">Total</option>
          </select>
        </div>

        {/* Bookmaker selector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bookmaker
          </label>
          <select
            value={bookmaker}
            onChange={(e) => setBookmaker(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="best">Best Line</option>
            {bookmakers.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="relative" style={{ height: chartHeight + 60 }}>
          <svg
            width="100%"
            height={chartHeight + 60}
            viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
            className="overflow-visible"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = ratio * chartHeight + 30;
              const value = max - ratio * (max - min);
              return (
                <g key={ratio}>
                  <line
                    x1="60"
                    y1={y}
                    x2={chartWidth - 20}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <text
                    x="50"
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs text-gray-600 dark:text-gray-400"
                  >
                    {formatOdds(Math.round(value))}
                  </text>
                </g>
              );
            })}

            {/* Home/Away lines */}
            {market !== "TOTAL" && (
              <>
                {/* Home line */}
                <polyline
                  points={points
                    .map((point, i) => {
                      if (!point.homeOdds) return null;
                      const x = indexToX(i, chartWidth - 80) + 60;
                      const y = valueToY(point.homeOdds, chartHeight) + 30;
                      return `${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(" ")}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />

                {/* Away line */}
                <polyline
                  points={points
                    .map((point, i) => {
                      if (!point.awayOdds) return null;
                      const x = indexToX(i, chartWidth - 80) + 60;
                      const y = valueToY(point.awayOdds, chartHeight) + 30;
                      return `${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(" ")}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Over/Under lines */}
            {market === "TOTAL" && (
              <>
                {/* Over line */}
                <polyline
                  points={points
                    .map((point, i) => {
                      if (!point.overOdds) return null;
                      const x = indexToX(i, chartWidth - 80) + 60;
                      const y = valueToY(point.overOdds, chartHeight) + 30;
                      return `${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(" ")}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Under line */}
                <polyline
                  points={points
                    .map((point, i) => {
                      if (!point.underOdds) return null;
                      const x = indexToX(i, chartWidth - 80) + 60;
                      const y = valueToY(point.underOdds, chartHeight) + 30;
                      return `${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(" ")}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Interactive points */}
            {points.map((point, i) => {
              const x = indexToX(i, chartWidth - 80) + 60;

              const pointsToRender = [];
              if (market !== "TOTAL") {
                if (point.homeOdds) {
                  pointsToRender.push({
                    y: valueToY(point.homeOdds, chartHeight) + 30,
                    color: "#3B82F6",
                    label: homeTeam,
                    odds: point.homeOdds,
                    line: point.line,
                  });
                }
                if (point.awayOdds) {
                  pointsToRender.push({
                    y: valueToY(point.awayOdds, chartHeight) + 30,
                    color: "#EF4444",
                    label: awayTeam,
                    odds: point.awayOdds,
                    line: point.line,
                  });
                }
              } else {
                if (point.overOdds) {
                  pointsToRender.push({
                    y: valueToY(point.overOdds, chartHeight) + 30,
                    color: "#10B981",
                    label: "Over",
                    odds: point.overOdds,
                    line: point.line,
                  });
                }
                if (point.underOdds) {
                  pointsToRender.push({
                    y: valueToY(point.underOdds, chartHeight) + 30,
                    color: "#F59E0B",
                    label: "Under",
                    odds: point.underOdds,
                    line: point.line,
                  });
                }
              }

              return pointsToRender.map((pt, j) => (
                <circle
                  key={`${i}-${j}`}
                  cx={x}
                  cy={pt.y}
                  r="4"
                  fill={pt.color}
                  className="hover:r-6 cursor-pointer transition-all"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredPoint({
                      index: i,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                />
              ));
            })}

            {/* Time axis labels */}
            {[0, Math.floor(points.length / 2), points.length - 1].map((i) => {
              if (i >= points.length) return null;
              const x = indexToX(i, chartWidth - 80) + 60;
              return (
                <text
                  key={i}
                  x={x}
                  y={chartHeight + 50}
                  textAnchor="middle"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  {formatTime(points[i].timestamp)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint !== null && points[hoveredPoint.index] && (
            <div
              className="pointer-events-none fixed z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              style={{
                left: hoveredPoint.x,
                top: hoveredPoint.y - 100,
                transform: "translateX(-50%)",
              }}
            >
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {formatTime(points[hoveredPoint.index].timestamp)}
              </div>
              <div className="mt-2 space-y-1">
                {market !== "TOTAL" ? (
                  <>
                    {points[hoveredPoint.index].homeOdds && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "#3B82F6" }}
                        />
                        <span className="font-medium">{homeTeam}:</span>
                        <span>
                          {formatOdds(points[hoveredPoint.index].homeOdds!)}
                        </span>
                      </div>
                    )}
                    {points[hoveredPoint.index].awayOdds && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "#EF4444" }}
                        />
                        <span className="font-medium">{awayTeam}:</span>
                        <span>
                          {formatOdds(points[hoveredPoint.index].awayOdds!)}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {points[hoveredPoint.index].overOdds && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "#10B981" }}
                        />
                        <span className="font-medium">Over:</span>
                        <span>
                          {formatOdds(points[hoveredPoint.index].overOdds!)}
                        </span>
                      </div>
                    )}
                    {points[hoveredPoint.index].underOdds && (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "#F59E0B" }}
                        />
                        <span className="font-medium">Under:</span>
                        <span>
                          {formatOdds(points[hoveredPoint.index].underOdds!)}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {points[hoveredPoint.index].line && (
                  <div className="mt-1 text-xs text-gray-500">
                    Line: {points[hoveredPoint.index].line}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          {market !== "TOTAL" ? (
            <>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {homeTeam}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {awayTeam}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Over
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Under
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
