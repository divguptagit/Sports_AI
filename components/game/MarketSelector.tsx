"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface MarketSelectorProps {
  selectedMarket: "ML" | "SPREAD" | "TOTAL";
  onMarketChange: (market: "ML" | "SPREAD" | "TOTAL") => void;
  viewMode: "best" | "bookmaker";
  onViewModeChange: (mode: "best" | "bookmaker") => void;
  selectedBookmaker?: string;
  bookmakers: string[];
  onBookmakerChange?: (bookmaker: string) => void;
}

export function MarketSelector({
  selectedMarket,
  onMarketChange,
  viewMode,
  onViewModeChange,
  selectedBookmaker,
  bookmakers,
  onBookmakerChange,
}: MarketSelectorProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      {/* Market Tabs */}
      <div>
        <label className="mb-3 block text-sm font-medium">Market</label>
        <Tabs
          value={selectedMarket}
          onValueChange={(v) => onMarketChange(v as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ML">Moneyline</TabsTrigger>
            <TabsTrigger value="SPREAD">Spread</TabsTrigger>
            <TabsTrigger value="TOTAL">Total</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* View Mode Toggle */}
      <div>
        <label className="mb-3 block text-sm font-medium">View</label>
        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
          <button
            onClick={() => onViewModeChange("best")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "best"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            )}
          >
            Best Line
          </button>
          <button
            onClick={() => onViewModeChange("bookmaker")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              viewMode === "bookmaker"
                ? "bg-background shadow-sm"
                : "hover:bg-background/50"
            )}
          >
            Choose Bookmaker
          </button>
        </div>
      </div>

      {/* Bookmaker Selector (when in bookmaker mode) */}
      {viewMode === "bookmaker" && bookmakers.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium">Bookmaker</label>
          <select
            value={selectedBookmaker}
            onChange={(e) => onBookmakerChange?.(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {bookmakers.map((bookmaker) => (
              <option key={bookmaker} value={bookmaker}>
                {bookmaker}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
