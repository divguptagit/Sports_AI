"use client";

import { memo } from "react";
import { TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OddsRow {
  bookmaker: string;
  homeOdds?: number;
  awayOdds?: number;
  overOdds?: number;
  underOdds?: number;
  line?: number;
  lastUpdated: Date;
  isBest?: boolean;
}

interface OddsTableProps {
  market: "ML" | "SPREAD" | "TOTAL";
  odds: OddsRow[];
  homeTeam: string;
  awayTeam: string;
}

export const OddsTable = memo(function OddsTable({
  market,
  odds,
  homeTeam,
  awayTeam,
}: OddsTableProps) {
  const formatOdds = (odds?: number) => {
    if (odds === undefined) return "-";
    if (odds > 0) return `+${odds}`;
    return odds.toString();
  };

  const formatLastUpdated = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Find best odds for highlighting
  const getBestOdds = (type: "home" | "away" | "over" | "under") => {
    if (market === "ML") {
      if (type === "home") {
        return Math.max(
          ...odds.filter((o) => o.homeOdds).map((o) => o.homeOdds!)
        );
      } else {
        return Math.max(
          ...odds.filter((o) => o.awayOdds).map((o) => o.awayOdds!)
        );
      }
    } else if (market === "TOTAL") {
      if (type === "over") {
        return Math.max(
          ...odds.filter((o) => o.overOdds).map((o) => o.overOdds!)
        );
      } else {
        return Math.max(
          ...odds.filter((o) => o.underOdds).map((o) => o.underOdds!)
        );
      }
    }
    return undefined;
  };

  const bestHomeOdds = getBestOdds("home");
  const bestAwayOdds = getBestOdds("away");
  const bestOverOdds = getBestOdds("over");
  const bestUnderOdds = getBestOdds("under");

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left font-medium">Bookmaker</th>
              {market === "ML" && (
                <>
                  <th className="px-6 py-3 text-center font-medium">
                    {awayTeam}
                  </th>
                  <th className="px-6 py-3 text-center font-medium">
                    {homeTeam}
                  </th>
                </>
              )}
              {market === "SPREAD" && (
                <>
                  <th className="px-6 py-3 text-center font-medium">Spread</th>
                  <th className="px-6 py-3 text-center font-medium">
                    {awayTeam}
                  </th>
                  <th className="px-6 py-3 text-center font-medium">
                    {homeTeam}
                  </th>
                </>
              )}
              {market === "TOTAL" && (
                <>
                  <th className="px-6 py-3 text-center font-medium">Line</th>
                  <th className="px-6 py-3 text-center font-medium">Over</th>
                  <th className="px-6 py-3 text-center font-medium">Under</th>
                </>
              )}
              <th className="px-6 py-3 text-right font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {odds.map((row, idx) => (
              <tr
                key={idx}
                className="border-b transition-colors last:border-0 hover:bg-muted/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{row.bookmaker}</span>
                    {row.isBest && (
                      <TrendingUp className="h-3.5 w-3.5 text-success" />
                    )}
                  </div>
                </td>
                {market === "ML" && (
                  <>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          row.awayOdds === bestAwayOdds &&
                            "font-semibold text-success"
                        )}
                      >
                        {formatOdds(row.awayOdds)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          row.homeOdds === bestHomeOdds &&
                            "font-semibold text-success"
                        )}
                      >
                        {formatOdds(row.homeOdds)}
                      </span>
                    </td>
                  </>
                )}
                {market === "SPREAD" && (
                  <>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-muted-foreground">
                        {row.line !== undefined
                          ? `${row.line > 0 ? "+" : ""}${row.line}`
                          : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-medium">
                        {formatOdds(row.awayOdds)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono font-medium">
                        {formatOdds(row.homeOdds)}
                      </span>
                    </td>
                  </>
                )}
                {market === "TOTAL" && (
                  <>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-muted-foreground">
                        {row.line !== undefined ? row.line.toFixed(1) : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          row.overOdds === bestOverOdds &&
                            "font-semibold text-success"
                        )}
                      >
                        {formatOdds(row.overOdds)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "font-mono font-medium",
                          row.underOdds === bestUnderOdds &&
                            "font-semibold text-success"
                        )}
                      >
                        {formatOdds(row.underOdds)}
                      </span>
                    </td>
                  </>
                )}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatLastUpdated(row.lastUpdated)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {odds.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No odds available for this market
        </div>
      )}
    </div>
  );
});
