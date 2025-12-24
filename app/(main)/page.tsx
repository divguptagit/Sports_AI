"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
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
import { Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Game {
  id: string;
  league: string;
  homeTeam: { abbr: string; name: string };
  awayTeam: { abbr: string; name: string };
  startTime: string;
  status: string;
  venue: string;
}

export default function SlatePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchGames();
  }, [selectedLeague, selectedDate]);

  async function fetchGames() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedLeague !== "all") params.set("league", selectedLeague);
      params.set("date", selectedDate);

      const response = await fetch(`/api/slate?${params.toString()}`);
      const data = await response.json();
      setGames(data.games || []);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Today's Slate
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View upcoming games and compare odds across bookmakers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          {/* League Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              League
            </label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Leagues</option>
              <option value="NFL">NFL</option>
              <option value="NBA">NBA</option>
              <option value="MLB">MLB</option>
              <option value="NHL">NHL</option>
              <option value="NCAAF">NCAAF</option>
              <option value="NCAAB">NCAAB</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Games Table */}
        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : games.length === 0 ? (
          <EmptyState
            title="No games found"
            description="There are no games scheduled for the selected date and league."
          />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>League</TableHead>
                  <TableHead>Matchup</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead align="center">Status</TableHead>
                  <TableHead align="right">Best Line</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {formatTime(game.startTime)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {game.league}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/game/${game.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <div className="font-medium">
                          {game.awayTeam.abbr} @ {game.homeTeam.abbr}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {game.awayTeam.name} at {game.homeTeam.name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {game.venue || "TBD"}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          game.status === "SCHEDULED"
                            ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            : game.status === "IN_PROGRESS"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {game.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <Link
                        href={`/game/${game.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <TrendingUp className="h-4 w-4" />
                        View Odds
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Stats */}
        {!loading && games.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Showing {games.length} game{games.length !== 1 ? "s" : ""} for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

