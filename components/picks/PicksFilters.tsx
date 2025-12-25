"use client";

import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PicksFiltersProps {
  league: string;
  onLeagueChange: (league: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  market: string;
  onMarketChange: (market: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
}

export function PicksFilters({
  league,
  onLeagueChange,
  dateRange,
  onDateRangeChange,
  market,
  onMarketChange,
  status,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onExport,
}: PicksFiltersProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      {/* Top Row: League & Date Range */}
      <div className="flex flex-wrap items-center gap-4">
        {/* NBA Badge */}
        <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 ring-1 ring-primary/20">
          <span className="text-sm font-bold text-primary">NBA</span>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Period:</label>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => onDateRangeChange("7d")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                dateRange === "7d"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              7D
            </button>
            <button
              onClick={() => onDateRangeChange("30d")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                dateRange === "30d"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              30D
            </button>
            <button
              onClick={() => onDateRangeChange("90d")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                dateRange === "90d"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              90D
            </button>
            <button
              onClick={() => onDateRangeChange("all")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                dateRange === "all"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              All
            </button>
          </div>
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Bottom Row: Market, Status, Search */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Market Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Market:</label>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => onMarketChange("all")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                market === "all"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              All
            </button>
            <button
              onClick={() => onMarketChange("MONEYLINE")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                market === "MONEYLINE"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              ML
            </button>
            <button
              onClick={() => onMarketChange("SPREAD")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                market === "SPREAD"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Spread
            </button>
            <button
              onClick={() => onMarketChange("TOTAL")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                market === "TOTAL"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Total
            </button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => onStatusChange("all")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === "all"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              All
            </button>
            <button
              onClick={() => onStatusChange("PENDING")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === "PENDING"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Open
            </button>
            <button
              onClick={() => onStatusChange("WON")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === "WON"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Won
            </button>
            <button
              onClick={() => onStatusChange("LOST")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === "LOST"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Lost
            </button>
            <button
              onClick={() => onStatusChange("PUSH")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                status === "PUSH"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:bg-background/50"
              )}
            >
              Push
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9"
          />
        </div>
      </div>
    </div>
  );
}
