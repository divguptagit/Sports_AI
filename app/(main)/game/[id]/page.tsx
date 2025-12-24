"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
} from "@/components/ui/Table";
import { ArrowLeft, Plus, Lock, TrendingUp } from "lucide-react";
import Link from "next/link";
import OddsMovementChart from "@/components/charts/OddsMovementChart";

interface Game {
  id: string;
  league: { abbr: string; name: string };
  homeTeam: { abbr: string; name: string; city: string };
  awayTeam: { abbr: string; name: string; city: string };
  startTime: string;
  status: string;
  venue: string;
}

type MarketType = "MONEYLINE" | "SPREAD" | "TOTAL";

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const [game, setGame] = useState<Game | null>(null);
  const [odds, setOdds] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [activeMarket, setActiveMarket] = useState<MarketType>("MONEYLINE");
  const [showPickModal, setShowPickModal] = useState(false);
  const [ageVerificationRequired, setAgeVerificationRequired] = useState(false);

  useEffect(() => {
    fetchGame();
    fetchOdds();
  }, [gameId]);

  async function fetchGame() {
    try {
      const response = await fetch(`/api/game/${gameId}`);
      const data = await response.json();
      setGame(data);
    } catch (error) {
      console.error("Failed to fetch game:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOdds() {
    setOddsLoading(true);
    try {
      const response = await fetch(`/api/game/${gameId}/odds`);
      if (response.status === 403) {
        setAgeVerificationRequired(true);
        return;
      }
      const data = await response.json();
      setOdds(data);
    } catch (error) {
      console.error("Failed to fetch odds:", error);
    } finally {
      setOddsLoading(false);
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatOdds(odds: number | null) {
    if (odds === null) return "-";
    return odds > 0 ? `+${odds}` : odds.toString();
  }

  const currentMarketOdds = odds?.markets?.find(
    (m: any) => m.type === activeMarket
  );

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <TableSkeleton rows={3} cols={4} />
        </div>
      </AppLayout>
    );
  }

  if (!game) {
    return (
      <AppLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Game not found</h2>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Slate
        </Link>

        {/* Game Header */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {game.league.abbr}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {game.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {game.awayTeam.name} @ {game.homeTeam.name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {formatTime(game.startTime)}
              </p>
              {game.venue && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {game.venue}
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowPickModal(true)}
              disabled={ageVerificationRequired}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Pick
            </Button>
          </div>
        </div>

        {/* Age Verification Notice */}
        {ageVerificationRequired && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Age Verification Required
                </h3>
                <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                  You must verify your age to view odds and create picks.{" "}
                  <Link
                    href="/settings"
                    className="font-medium underline hover:no-underline"
                  >
                    Verify Now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Market Tabs */}
        {!ageVerificationRequired && (
          <>
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              {["MONEYLINE", "SPREAD", "TOTAL"].map((market) => (
                <button
                  key={market}
                  onClick={() => setActiveMarket(market as MarketType)}
                  className={`border-b-2 px-4 py-2 font-medium transition-colors ${
                    activeMarket === market
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  {market.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Odds Table */}
            {oddsLoading ? (
              <TableSkeleton rows={5} cols={4} />
            ) : currentMarketOdds?.bookmakers?.length > 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bookmaker</TableHead>
                      {activeMarket === "MONEYLINE" && (
                        <>
                          <TableHead align="right">{game.awayTeam.abbr}</TableHead>
                          <TableHead align="right">{game.homeTeam.abbr}</TableHead>
                        </>
                      )}
                      {activeMarket === "SPREAD" && (
                        <>
                          <TableHead align="center">Line</TableHead>
                          <TableHead align="right">{game.awayTeam.abbr}</TableHead>
                          <TableHead align="right">{game.homeTeam.abbr}</TableHead>
                        </>
                      )}
                      {activeMarket === "TOTAL" && (
                        <>
                          <TableHead align="center">Line</TableHead>
                          <TableHead align="right">Over</TableHead>
                          <TableHead align="right">Under</TableHead>
                        </>
                      )}
                      <TableHead align="right">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMarketOdds.bookmakers.map((bookmaker: any) => (
                      <TableRow key={bookmaker.name}>
                        <TableCell className="font-medium">
                          {bookmaker.displayName}
                        </TableCell>
                        {activeMarket === "MONEYLINE" && (
                          <>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.awayOdds)}
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.homeOdds)}
                            </TableCell>
                          </>
                        )}
                        {activeMarket === "SPREAD" && (
                          <>
                            <TableCell align="center" className="font-mono">
                              {bookmaker.line ? formatOdds(bookmaker.line) : "-"}
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.awayOdds)}
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.homeOdds)}
                            </TableCell>
                          </>
                        )}
                        {activeMarket === "TOTAL" && (
                          <>
                            <TableCell align="center" className="font-mono">
                              {bookmaker.line || "-"}
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.overOdds)}
                            </TableCell>
                            <TableCell align="right" className="font-mono">
                              {formatOdds(bookmaker.underOdds)}
                            </TableCell>
                          </>
                        )}
                        <TableCell align="right" className="text-sm text-gray-500">
                          {new Date(bookmaker.timestamp).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400">
                  No odds available for this market
                </p>
              </div>
            )}
          </>
        )}

        {/* Odds Movement Chart */}
        {!ageVerificationRequired && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Odds Movement
              </h2>
            </div>
            <OddsMovementChart
              gameId={gameId}
              homeTeam={game.homeTeam.abbr}
              awayTeam={game.awayTeam.abbr}
            />
          </div>
        )}

        {/* Create Pick Modal */}
        <CreatePickModal
          isOpen={showPickModal}
          onClose={() => setShowPickModal(false)}
          game={game}
          market={activeMarket}
        />
      </div>
    </AppLayout>
  );
}

function CreatePickModal({
  isOpen,
  onClose,
  game,
  market,
}: {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  market: MarketType;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      gameId: game.id,
      marketType: market,
      side: formData.get("side"),
      odds: parseFloat(formData.get("odds") as string),
      line: formData.get("line")
        ? parseFloat(formData.get("line") as string)
        : undefined,
      units: parseFloat(formData.get("units") as string),
      notes: formData.get("notes") || undefined,
    };

    try {
      const response = await fetch("/api/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to create pick");
      }

      onClose();
      alert("Pick created successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Simulated Pick">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Market</label>
          <input
            type="text"
            value={market}
            disabled
            className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Side</label>
          <select
            name="side"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
          >
            {market === "MONEYLINE" || market === "SPREAD" ? (
              <>
                <option value="AWAY">{game.awayTeam.abbr}</option>
                <option value="HOME">{game.homeTeam.abbr}</option>
              </>
            ) : (
              <>
                <option value="OVER">Over</option>
                <option value="UNDER">Under</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Odds (American format)
          </label>
          <input
            type="number"
            name="odds"
            required
            step="1"
            placeholder="-110"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        {(market === "SPREAD" || market === "TOTAL") && (
          <div>
            <label className="mb-2 block text-sm font-medium">Line</label>
            <input
              type="number"
              name="line"
              step="0.5"
              placeholder="3.5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Units (0.1 - 10)
          </label>
          <input
            type="number"
            name="units"
            required
            step="0.1"
            min="0.1"
            max="10"
            defaultValue="1"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Analysis or reasoning..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading} className="flex-1">
            Create Pick
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

