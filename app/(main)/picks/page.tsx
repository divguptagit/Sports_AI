"use client";

import { useState, useEffect } from "react";
// Layout is now in root layout.tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  EmptyState,
} from "@/components/ui/Table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Pick {
  id: string;
  game: {
    league: string;
    homeTeam: string;
    awayTeam: string;
    startTime: string;
  };
  market: string;
  side: string;
  odds: number;
  line: number | null;
  units: number;
  result: string;
  pickedAt: string;
}

export default function PicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>("pickedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchPicks();
  }, [filterStatus]);

  async function fetchPicks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);

      const response = await fetch(`/api/picks?${params.toString()}`);
      const data = await response.json();
      setPicks(data.picks || []);
    } catch (error) {
      console.error("Failed to fetch picks:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats() {
    const wins = picks.filter((p) => p.result === "WIN").length;
    const losses = picks.filter((p) => p.result === "LOSS").length;
    const pushes = picks.filter((p) => p.result === "PUSH").length;
    const pending = picks.filter((p) => p.result === "PENDING").length;

    const totalUnits = picks.reduce((sum, p) => sum + p.units, 0);
    const profitUnits = picks.reduce((sum, p) => {
      if (p.result === "WIN") {
        const payout =
          p.odds > 0
            ? (p.odds / 100) * p.units
            : (100 / Math.abs(p.odds)) * p.units;
        return sum + payout;
      }
      if (p.result === "LOSS") return sum - p.units;
      return sum;
    }, 0);

    const roi = totalUnits > 0 ? (profitUnits / totalUnits) * 100 : 0;
    const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

    return { wins, losses, pushes, pending, profitUnits, roi, winRate };
  }

  const stats = calculateStats();

  function formatOdds(odds: number) {
    return odds > 0 ? `+${odds}` : odds.toString();
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Picks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your simulated picks and performance
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Record
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.wins}-{stats.losses}-{stats.pushes}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {stats.pending} pending
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Win Rate
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {stats.winRate.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Profit/Loss
            </div>
            <div
              className={`mt-2 flex items-center gap-2 text-2xl font-bold ${
                stats.profitUnits > 0
                  ? "text-green-600"
                  : stats.profitUnits < 0
                    ? "text-red-600"
                    : "text-gray-900 dark:text-white"
              }`}
            >
              {stats.profitUnits > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : stats.profitUnits < 0 ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Minus className="h-5 w-5" />
              )}
              {stats.profitUnits > 0 ? "+" : ""}
              {stats.profitUnits.toFixed(2)}u
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ROI
            </div>
            <div
              className={`mt-2 text-2xl font-bold ${
                stats.roi > 0
                  ? "text-green-600"
                  : stats.roi < 0
                    ? "text-red-600"
                    : "text-gray-900 dark:text-white"
              }`}
            >
              {stats.roi > 0 ? "+" : ""}
              {stats.roi.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "PENDING", "WIN", "LOSS", "PUSH"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {status === "all" ? "All" : status}
            </button>
          ))}
        </div>

        {/* Picks Table */}
        {loading ? (
          <TableSkeleton rows={5} cols={8} />
        ) : picks.length === 0 ? (
          <EmptyState
            title="No picks yet"
            description="Create your first simulated pick to start tracking your performance."
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>League</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Pick</TableHead>
                  <TableHead align="right">Odds</TableHead>
                  <TableHead align="right">Units</TableHead>
                  <TableHead align="center">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {picks.map((pick) => (
                  <TableRow key={pick.id}>
                    <TableCell className="text-sm">
                      {formatDate(pick.pickedAt)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {pick.game.league}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {pick.game.awayTeam} @ {pick.game.homeTeam}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{pick.market}</TableCell>
                    <TableCell>
                      <div className="font-medium">{pick.side}</div>
                      {pick.line && (
                        <div className="text-xs text-gray-500">
                          Line: {pick.line}
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right" className="font-mono">
                      {formatOdds(pick.odds)}
                    </TableCell>
                    <TableCell align="right">{pick.units}</TableCell>
                    <TableCell align="center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          pick.result === "WIN"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : pick.result === "LOSS"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : pick.result === "PUSH"
                                ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {pick.result}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
