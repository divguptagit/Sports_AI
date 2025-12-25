"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { GameHeader } from "@/components/game/GameHeader";
import { MarketSelector } from "@/components/game/MarketSelector";
import { OddsTable } from "@/components/game/OddsTable";
import { LineMovementCard } from "@/components/game/LineMovementCard";
import { CreatePickModal } from "@/components/game/CreatePickModal";
import { StatsRail } from "@/components/game/StatsRail";
import { Button } from "@/components/ui/Button";
import { GameCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
// Analytics baseline will be integrated when available

interface Game {
  id: string;
  league: { abbr: string; name: string };
  homeTeam: { abbr: string; name: string; city: string };
  awayTeam: { abbr: string; name: string; city: string };
  startTime: string;
  status: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
}

interface OddsData {
  bookmaker: string;
  homeOdds?: number;
  awayOdds?: number;
  overOdds?: number;
  underOdds?: number;
  line?: number;
  lastUpdated: string;
}

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [odds, setOdds] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [selectedMarket, setSelectedMarket] = useState<
    "ML" | "SPREAD" | "TOTAL"
  >("ML");
  const [viewMode, setViewMode] = useState<"best" | "bookmaker">("best");
  const [selectedBookmaker, setSelectedBookmaker] = useState<string>("");
  const [createPickModalOpen, setCreatePickModalOpen] = useState(false);
  const [ageVerificationRequired, setAgeVerificationRequired] = useState(false);

  useEffect(() => {
    fetchGame();
    fetchOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/game/${gameId}`);
      if (!response.ok) throw new Error("Failed to fetch game");
      const data = await response.json();
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch game");
    } finally {
      setLoading(false);
    }
  };

  const fetchOdds = async () => {
    setOddsLoading(true);
    try {
      const response = await fetch(`/api/game/${gameId}/odds`);
      if (response.status === 403) {
        setAgeVerificationRequired(true);
        return;
      }
      if (!response.ok) throw new Error("Failed to fetch odds");
      const data = await response.json();

      // Mock odds data for demonstration
      const mockOdds: OddsData[] = [
        {
          bookmaker: "DraftKings",
          homeOdds: -110,
          awayOdds: -110,
          line: -3.5,
          overOdds: -110,
          underOdds: -110,
          lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
        },
        {
          bookmaker: "FanDuel",
          homeOdds: -105,
          awayOdds: -115,
          line: -3,
          overOdds: -108,
          underOdds: -112,
          lastUpdated: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          bookmaker: "BetMGM",
          homeOdds: -112,
          awayOdds: -108,
          line: -3.5,
          overOdds: -110,
          underOdds: -110,
          lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          bookmaker: "Caesars",
          homeOdds: -110,
          awayOdds: -110,
          line: -3,
          overOdds: -115,
          underOdds: -105,
          lastUpdated: new Date(Date.now() - 20 * 60000).toISOString(),
        },
      ];

      setOdds(mockOdds);
      if (mockOdds.length > 0 && !selectedBookmaker) {
        setSelectedBookmaker(mockOdds[0].bookmaker);
      }
    } catch (err) {
      console.error("Failed to fetch odds:", err);
    } finally {
      setOddsLoading(false);
    }
  };

  // Memoized bookmakers list
  const bookmakers = useMemo(() => {
    return Array.from(new Set(odds.map((o) => o.bookmaker)));
  }, [odds]);

  // Memoized filtered odds for table
  const tableOdds = useMemo(() => {
    if (viewMode === "bookmaker" && selectedBookmaker) {
      return odds.filter((o) => o.bookmaker === selectedBookmaker);
    }
    return odds;
  }, [odds, viewMode, selectedBookmaker]);

  // Memoized odds for selected market
  const currentMarketOdds = useMemo(() => {
    const bestOdd = odds[0]; // Simplified - would find actual best
    if (!bestOdd) return undefined;

    if (selectedMarket === "ML") {
      return {
        homeOdds: bestOdd.homeOdds,
        awayOdds: bestOdd.awayOdds,
      };
    } else if (selectedMarket === "SPREAD") {
      return {
        homeOdds: bestOdd.homeOdds,
        awayOdds: bestOdd.awayOdds,
        line: bestOdd.line,
      };
    } else {
      return {
        overOdds: bestOdd.overOdds,
        underOdds: bestOdd.underOdds,
        line: bestOdd.line,
      };
    }
  }, [odds, selectedMarket]);

  // Calculate analytics stats (mock data for now)
  const analyticsStats = useMemo(() => {
    if (!currentMarketOdds) return undefined;

    // TODO: Integrate with actual baseline prediction module
    return {
      baselineWinProb: 0.52,
      edge: 0.03,
      confidence: "High" as const,
      dataFreshness: "Current" as const,
    };
  }, [currentMarketOdds]);

  // Handlers
  const handleCreatePick = useCallback(() => {
    setCreatePickModalOpen(true);
  }, []);

  const handleCreateAlert = useCallback(() => {
    // TODO: Implement alert creation
    console.log("Create alert for game:", gameId);
  }, [gameId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <GameCardSkeleton count={1} />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="py-12">
        <EmptyState
          icon={AlertCircle}
          title="Game not found"
          message={error || "The requested game could not be found"}
          action={{
            label: "Back to Slate",
            onClick: () => (window.location.href = "/"),
          }}
        />
      </div>
    );
  }

  if (ageVerificationRequired) {
    return (
      <div className="py-12">
        <EmptyState
          icon={AlertCircle}
          title="Age Verification Required"
          message="You must verify your age to view odds data"
          action={{
            label: "Go to Settings",
            onClick: () => (window.location.href = "/settings"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Slate
      </Link>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content (2/3 width) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Game Header */}
          <GameHeader
            game={game}
            homeRecord="12-4" // TODO: Fetch from API
            awayRecord="10-6" // TODO: Fetch from API
          />

          {/* Market Selector */}
          <MarketSelector
            selectedMarket={selectedMarket}
            onMarketChange={setSelectedMarket}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedBookmaker={selectedBookmaker}
            bookmakers={bookmakers}
            onBookmakerChange={setSelectedBookmaker}
          />

          {/* Odds Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Odds</h3>
              <Button size="sm" onClick={handleCreatePick}>
                Track Pick
              </Button>
            </div>
            {oddsLoading ? (
              <div className="rounded-lg border bg-card p-12">
                <div className="text-center text-sm text-muted-foreground">
                  Loading odds...
                </div>
              </div>
            ) : (
              <OddsTable
                market={selectedMarket}
                odds={tableOdds.map((o) => ({
                  ...o,
                  lastUpdated: new Date(o.lastUpdated),
                }))}
                homeTeam={game.homeTeam.abbr}
                awayTeam={game.awayTeam.abbr}
              />
            )}
          </div>

          {/* Line Movement Chart */}
          <LineMovementCard gameId={gameId} market={selectedMarket} />
        </div>

        {/* Right Rail - Stats & Actions (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <StatsRail
              gameId={gameId}
              stats={analyticsStats}
              onCreateAlert={handleCreateAlert}
            />
          </div>
        </div>
      </div>

      {/* Create Pick Modal */}
      <CreatePickModal
        open={createPickModalOpen}
        onOpenChange={setCreatePickModalOpen}
        game={game}
        market={selectedMarket}
        odds={currentMarketOdds}
      />
    </div>
  );
}
