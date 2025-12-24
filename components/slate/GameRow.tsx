"use client";

import { useState, memo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface GameRowProps {
  game: {
    id: string;
    homeTeam: { abbr: string; name: string };
    awayTeam: { abbr: string; name: string };
    startTime: string;
    status: string;
    bestLine?: {
      market: string;
      home: number;
      away: number;
      movement: "up" | "down" | "none";
      movementAmount?: number;
    };
    odds?: Array<{
      bookmaker: string;
      homeOdds: number;
      awayOdds: number;
      spread?: number;
      total?: number;
    }>;
  };
  market: "ML" | "SPREAD" | "TOTAL";
  onCreatePick?: (gameId: string) => void;
}

export const GameRow = memo(function GameRow({
  game,
  market,
  onCreatePick,
}: GameRowProps) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatOdds = (odds: number) => {
    if (odds > 0) return `+${odds}`;
    return odds.toString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Badge variant="success">Live</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "FINAL":
        return <Badge variant="outline">Final</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMovementIcon = (movement?: "up" | "down" | "none") => {
    if (movement === "up")
      return <TrendingUp className="h-3 w-3 text-success" />;
    if (movement === "down")
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    return null;
  };

  return (
    <div className="border-b transition-colors last:border-0 hover:bg-muted/50">
      {/* Main Row */}
      <div className="grid grid-cols-12 items-center gap-4 px-6 py-4">
        {/* Time - 1 col */}
        <div className="col-span-1">
          <div className="text-sm font-medium">
            {formatTime(game.startTime)}
          </div>
          {getStatusBadge(game.status)}
        </div>

        {/* Teams - 4 cols */}
        <div className="col-span-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{game.awayTeam.abbr}</span>
              <span className="text-xs text-muted-foreground">@</span>
              <span className="text-sm font-semibold">
                {game.homeTeam.abbr}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {game.awayTeam.name} at {game.homeTeam.name}
            </div>
          </div>
        </div>

        {/* Best Line - 3 cols */}
        <div className="col-span-3">
          {game.bestLine ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-mono text-sm font-medium">
                  {formatOdds(game.bestLine.away)}
                </span>
                <span className="font-mono text-sm font-semibold">
                  {formatOdds(game.bestLine.home)}
                </span>
              </div>
              {game.bestLine.movement !== "none" && (
                <div className="flex items-center gap-1 text-xs">
                  {getMovementIcon(game.bestLine.movement)}
                  <span className="text-muted-foreground">
                    {game.bestLine.movementAmount
                      ? `${Math.abs(game.bestLine.movementAmount)}`
                      : ""}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No odds</span>
          )}
        </div>

        {/* Actions - 3 cols */}
        <div className="col-span-3 flex items-center gap-2">
          <Link href={`/game/${game.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onCreatePick?.(game.id)}
          >
            <Target className="mr-1.5 h-3.5 w-3.5" />
            Track Pick
          </Button>
        </div>

        {/* Expand Toggle - 1 col */}
        <div className="col-span-1 flex justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md p-1 hover:bg-muted"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Odds Table */}
      {expanded && game.odds && (
        <div className="border-t bg-muted/30 px-6 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Odds Comparison</h4>
            <div className="rounded-md border bg-background">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium">
                      Bookmaker
                    </th>
                    <th className="px-4 py-2 text-center font-medium">Away</th>
                    <th className="px-4 py-2 text-center font-medium">Home</th>
                    {market === "SPREAD" && (
                      <th className="px-4 py-2 text-center font-medium">
                        Spread
                      </th>
                    )}
                    {market === "TOTAL" && (
                      <th className="px-4 py-2 text-center font-medium">
                        Total
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {game.odds.map((odd, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-2 font-medium">{odd.bookmaker}</td>
                      <td className="px-4 py-2 text-center font-mono">
                        {formatOdds(odd.awayOdds)}
                      </td>
                      <td className="px-4 py-2 text-center font-mono font-semibold">
                        {formatOdds(odd.homeOdds)}
                      </td>
                      {market === "SPREAD" && odd.spread !== undefined && (
                        <td className="px-4 py-2 text-center font-mono">
                          {odd.spread > 0 ? "+" : ""}
                          {odd.spread}
                        </td>
                      )}
                      {market === "TOTAL" && odd.total !== undefined && (
                        <td className="px-4 py-2 text-center font-mono">
                          {odd.total}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
