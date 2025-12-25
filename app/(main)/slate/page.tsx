"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SlateFilters } from "@/components/slate/SlateFilters";
import { GameRow } from "@/components/slate/GameRow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { GameCardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Calendar, AlertCircle, Target } from "lucide-react";

interface Game {
  id: string;
  league: string;
  homeTeam: { abbr: string; name: string };
  awayTeam: { abbr: string; name: string };
  startTime: string;
  status: string;
  venue: string;
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
}

export default function SlatePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedLeague, setSelectedLeague] = useState<string>("NBA");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMarket, setSelectedMarket] = useState<
    "ML" | "SPREAD" | "TOTAL"
  >("ML");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveOnly, setLiveOnly] = useState(false);

  // Create Pick Modal
  const [createPickModalOpen, setCreatePickModalOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Fetch games
  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLeague, selectedDate]);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("league", "NBA");
      params.set("date", selectedDate);

      const response = await fetch(`/api/slate?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();

      // Mock best line data for demonstration
      const gamesWithMockData = (data.games || []).map((game: Game) => ({
        ...game,
        bestLine: {
          market: selectedMarket,
          home: -110,
          away: -110,
          movement: Math.random() > 0.5 ? "up" : "down",
          movementAmount: Math.floor(Math.random() * 10),
        },
        odds: [
          {
            bookmaker: "DraftKings",
            homeOdds: -110,
            awayOdds: -110,
            spread: -3.5,
            total: 47.5,
          },
          {
            bookmaker: "FanDuel",
            homeOdds: -105,
            awayOdds: -115,
            spread: -3,
            total: 48,
          },
          {
            bookmaker: "BetMGM",
            homeOdds: -112,
            awayOdds: -108,
            spread: -3.5,
            total: 47,
          },
        ],
      }));

      setGames(gamesWithMockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered games
  const filteredGames = useMemo(() => {
    let filtered = games;

    // Filter by live status
    if (liveOnly) {
      filtered = filtered.filter((game) => game.status === "IN_PROGRESS");
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.homeTeam.name.toLowerCase().includes(query) ||
          game.homeTeam.abbr.toLowerCase().includes(query) ||
          game.awayTeam.name.toLowerCase().includes(query) ||
          game.awayTeam.abbr.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [games, liveOnly, searchQuery]);

  // Memoized handlers
  const handleCreatePick = useCallback((gameId: string) => {
    setSelectedGameId(gameId);
    setCreatePickModalOpen(true);
  }, []);

  const handleCreatePickSubmit = useCallback(() => {
    // TODO: Implement pick creation logic
    console.log("Creating pick for game:", selectedGameId);
    setCreatePickModalOpen(false);
    setSelectedGameId(null);
  }, [selectedGameId]);

  // Stats
  const stats = useMemo(() => {
    const liveCount = filteredGames.filter(
      (g) => g.status === "IN_PROGRESS"
    ).length;
    const upcomingCount = filteredGames.filter(
      (g) => g.status === "SCHEDULED"
    ).length;

    return {
      total: filteredGames.length,
      live: liveCount,
      upcoming: upcomingCount,
    };
  }, [filteredGames]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Today's Slate"
        description="Premium odds comparison and simulated pick tracking"
      />

      {/* Filters */}
      <SlateFilters
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        liveOnly={liveOnly}
        onLiveOnlyChange={setLiveOnly}
      />

      {/* Stats Bar */}
      {!loading && filteredGames.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border bg-muted/50 px-6 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{stats.total}</span>
            <span className="text-muted-foreground">games</span>
          </div>
          {stats.live > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-success">{stats.live}</span>
                <span className="text-muted-foreground">live</span>
              </div>
            </>
          )}
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-semibold">{stats.upcoming}</span>
            <span className="text-muted-foreground">upcoming</span>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            Showing{" "}
            {selectedMarket === "ML"
              ? "Moneyline"
              : selectedMarket === "SPREAD"
                ? "Spread"
                : "Total"}{" "}
            odds
          </div>
        </div>
      )}

      {/* Games Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 items-center gap-4 border-b bg-muted/50 px-6 py-3 text-sm font-medium">
          <div className="col-span-1">Time</div>
          <div className="col-span-4">Matchup</div>
          <div className="col-span-3">Best Line</div>
          <div className="col-span-3">Actions</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div>
          {loading ? (
            <div className="p-6">
              <GameCardSkeleton count={5} />
            </div>
          ) : error ? (
            <div className="p-12">
              <EmptyState
                icon={AlertCircle}
                title="Error loading games"
                message={error}
                action={{
                  label: "Try Again",
                  onClick: fetchGames,
                }}
              />
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Calendar}
                title="No games found"
                message={
                  searchQuery
                    ? `No games match "${searchQuery}"`
                    : liveOnly
                      ? "No live games at the moment"
                      : "No games scheduled for this date"
                }
                action={
                  searchQuery || liveOnly
                    ? {
                        label: "Clear Filters",
                        onClick: () => {
                          setSearchQuery("");
                          setLiveOnly(false);
                        },
                      }
                    : undefined
                }
              />
            </div>
          ) : (
            filteredGames.map((game) => (
              <GameRow
                key={game.id}
                game={game}
                market={selectedMarket}
                onCreatePick={handleCreatePick}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Pick Modal */}
      <Dialog open={createPickModalOpen} onOpenChange={setCreatePickModalOpen}>
        <DialogContent onClose={() => setCreatePickModalOpen(false)}>
          <DialogHeader>
            <DialogTitle>Track Simulated Pick</DialogTitle>
            <DialogDescription>
              Record your analytical prediction for tracking purposes only. This
              is not real money betting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>
                  Pick tracking feature coming soon. This will allow you to
                  record your predictions for analysis.
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreatePickModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePickSubmit}>Track Pick</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
