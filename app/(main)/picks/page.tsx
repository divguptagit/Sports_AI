"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { PicksKPIs } from "@/components/picks/PicksKPIs";
import { PicksFilters } from "@/components/picks/PicksFilters";
import { PickDetailDrawer } from "@/components/picks/PickDetailDrawer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ClipboardList, ArrowUpDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pick {
  id: string;
  date: string;
  game: {
    league: string;
    homeTeam: string;
    awayTeam: string;
  };
  market: string;
  side: string;
  odds: number;
  units: number;
  result?: string;
  edge?: number;
  notes?: string;
  impliedProbability?: number;
  createdAt: string;
  settledAt?: string;
  profit?: number;
}

type SortField = "date" | "odds" | "units" | "result" | "edge";
type SortDirection = "asc" | "desc";

export default function PicksPage() {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [league, setLeague] = useState("all");
  const [dateRange, setDateRange] = useState("30d");
  const [market, setMarket] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Detail drawer
  const [selectedPick, setSelectedPick] = useState<Pick | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchPicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPicks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for demonstration
      const mockPicks: Pick[] = [
        {
          id: "1",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          game: {
            league: "NFL",
            homeTeam: "Chiefs",
            awayTeam: "Bills",
          },
          market: "MONEYLINE",
          side: "Chiefs",
          odds: -150,
          units: 1.5,
          result: "WON",
          edge: 3.2,
          notes: "Strong home advantage",
          impliedProbability: 60,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          settledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          profit: 1.0,
        },
        {
          id: "2",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          game: {
            league: "NBA",
            homeTeam: "Lakers",
            awayTeam: "Warriors",
          },
          market: "SPREAD",
          side: "Lakers -5.5",
          odds: -110,
          units: 2.0,
          result: "LOST",
          edge: -1.5,
          notes: "Injury to key player",
          impliedProbability: 52.4,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          settledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          profit: -2.0,
        },
        {
          id: "3",
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          game: {
            league: "NFL",
            homeTeam: "49ers",
            awayTeam: "Seahawks",
          },
          market: "TOTAL",
          side: "Over 47.5",
          odds: -105,
          units: 1.0,
          result: "PENDING",
          edge: 2.1,
          notes: "High-scoring offenses",
          impliedProbability: 51.2,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setPicks(mockPicks);
    } catch (err) {
      setError("Failed to load picks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPI stats
  const stats = useMemo(() => {
    const settledPicks = picks.filter((p) => p.result && p.result !== "PENDING");
    const wonPicks = picks.filter((p) => p.result === "WON");
    const totalUnits = settledPicks.reduce((sum, p) => sum + (p.profit || 0), 0);
    const totalRisked = settledPicks.reduce((sum, p) => sum + p.units, 0);
    const roi = totalRisked > 0 ? (totalUnits / totalRisked) * 100 : 0;
    const winRate =
      settledPicks.length > 0 ? (wonPicks.length / settledPicks.length) * 100 : 0;
    const avgEdge =
      picks.length > 0
        ? picks.reduce((sum, p) => sum + (p.edge || 0), 0) / picks.length
        : 0;

    const last7DaysPicks = picks.filter(
      (p) =>
        new Date(p.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 &&
        p.result &&
        p.result !== "PENDING"
    );
    const last7DaysUnits = last7DaysPicks.reduce(
      (sum, p) => sum + (p.profit || 0),
      0
    );
    const last7DaysChange = 0; // Placeholder

    return {
      totalUnits,
      roi,
      winRate,
      avgEdge,
      last7Days: {
        units: last7DaysUnits,
        change: last7DaysChange,
      },
    };
  }, [picks]);

  // Filter picks
  const filteredPicks = useMemo(() => {
    let filtered = picks;

    if (league !== "all") {
      filtered = filtered.filter((p) => p.game.league === league);
    }

    if (market !== "all") {
      filtered = filtered.filter((p) => p.market === market);
    }

    if (status !== "all") {
      filtered = filtered.filter((p) => p.result === status);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.game.homeTeam.toLowerCase().includes(query) ||
          p.game.awayTeam.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [picks, league, market, status, searchQuery]);

  // Sort picks
  const sortedPicks = useMemo(() => {
    const sorted = [...filteredPicks];
    sorted.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "date":
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
          break;
        case "odds":
          aVal = a.odds;
          bVal = b.odds;
          break;
        case "units":
          aVal = a.units;
          bVal = b.units;
          break;
        case "edge":
          aVal = a.edge || 0;
          bVal = b.edge || 0;
          break;
        case "result":
          aVal = a.result || "";
          bVal = b.result || "";
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredPicks, sortField, sortDirection]);

  // Handlers
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField, sortDirection]
  );

  const handleRowClick = useCallback((pick: Pick) => {
    setSelectedPick(pick);
    setDrawerOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    // Generate CSV
    const headers = [
      "Date",
      "League",
      "Game",
      "Market",
      "Side",
      "Odds",
      "Units",
      "Result",
      "Edge",
      "Profit",
      "Notes",
    ];
    const rows = sortedPicks.map((p) => [
      new Date(p.date).toLocaleDateString(),
      p.game.league,
      `${p.game.awayTeam} @ ${p.game.homeTeam}`,
      p.market,
      p.side,
      p.odds,
      p.units,
      p.result || "PENDING",
      p.edge?.toFixed(2) || "",
      p.profit?.toFixed(2) || "",
      p.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `picks-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sortedPicks]);

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : odds.toString();
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case "WON":
        return <Badge variant="success">Won</Badge>;
      case "LOST":
        return <Badge variant="destructive">Lost</Badge>;
      case "PUSH":
        return <Badge variant="secondary">Push</Badge>;
      default:
        return <Badge variant="outline">Open</Badge>;
    }
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 font-medium hover:text-foreground"
      >
        {children}
        <ArrowUpDown
          className={cn(
            "h-3.5 w-3.5",
            sortField === field ? "text-primary" : "text-muted-foreground"
          )}
        />
      </button>
    </TableHead>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Simulated Picks Dashboard"
          description="Track and analyze your simulated pick performance"
        />
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <EmptyState
          icon={ClipboardList}
          title="Error loading picks"
          message={error}
          action={{ label: "Retry", onClick: fetchPicks }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Simulated Picks Dashboard"
        description="Track and analyze your simulated pick performance"
      />

      {/* KPIs */}
      {picks.length > 0 && <PicksKPIs stats={stats} />}

      {/* Filters */}
      {picks.length > 0 && (
        <PicksFilters
          league={league}
          onLeagueChange={setLeague}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          market={market}
          onMarketChange={setMarket}
          status={status}
          onStatusChange={setStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExport={handleExport}
        />
      )}

      {/* Table or Empty State */}
      {picks.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No simulated picks yet"
          message="Start tracking your analytical predictions by creating picks from the Slate or Game pages."
          action={{
            label: "View Today's Slate",
            onClick: () => (window.location.href = "/"),
          }}
        />
      ) : sortedPicks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No picks match your filters"
          message="Try adjusting your filters to see more results."
        />
      ) : (
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-card">
                <SortableHeader field="date">Date</SortableHeader>
                <TableHead>League</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Side</TableHead>
                <SortableHeader field="odds">Odds</SortableHeader>
                <SortableHeader field="units">Units</SortableHeader>
                <SortableHeader field="result">Result</SortableHeader>
                <SortableHeader field="edge">Edge</SortableHeader>
                <TableHead className="w-[100px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPicks.map((pick) => (
                <tr
                  key={pick.id}
                  onClick={() => handleRowClick(pick)}
                  className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="text-sm">
                    {new Date(pick.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{pick.game.league}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {pick.game.awayTeam} @ {pick.game.homeTeam}
                  </TableCell>
                  <TableCell className="text-sm">{pick.market}</TableCell>
                  <TableCell className="font-medium">{pick.side}</TableCell>
                  <TableCell className="font-mono font-medium">
                    {formatOdds(pick.odds)}
                  </TableCell>
                  <TableCell className="font-medium">{pick.units}</TableCell>
                  <TableCell>{getResultBadge(pick.result)}</TableCell>
                  <TableCell>
                    {pick.edge !== undefined ? (
                      <span
                        className={cn(
                          "font-medium",
                          pick.edge >= 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        {pick.edge >= 0 ? "+" : ""}
                        {pick.edge.toFixed(1)}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {pick.notes ? (
                      <span className="line-clamp-1">{pick.notes}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pick Detail Drawer */}
      <PickDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        pick={selectedPick}
      />
    </div>
  );
}
