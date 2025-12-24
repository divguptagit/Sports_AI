"use client";

import { useState } from "react";
import { Calendar, Search, Filter, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SlateFiltersProps {
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedMarket: "ML" | "SPREAD" | "TOTAL";
  onMarketChange: (market: "ML" | "SPREAD" | "TOTAL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  liveOnly: boolean;
  onLiveOnlyChange: (liveOnly: boolean) => void;
}

export function SlateFilters({
  selectedLeague,
  onLeagueChange,
  selectedDate,
  onDateChange,
  selectedMarket,
  onMarketChange,
  searchQuery,
  onSearchChange,
  liveOnly,
  onLiveOnlyChange,
}: SlateFiltersProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const leagues = [
    { value: "all", label: "All Leagues" },
    { value: "NFL", label: "NFL" },
    { value: "NBA", label: "NBA" },
  ];

  const markets = [
    { value: "ML", label: "Moneyline" },
    { value: "SPREAD", label: "Spread" },
    { value: "TOTAL", label: "Total" },
  ];

  const quickDates = [
    { label: "Today", value: new Date().toISOString().split("T")[0] },
    {
      label: "Tomorrow",
      value: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    },
  ];

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      {/* Top Row: League + Date + Live Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        {/* League Selector */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {leagues.map((league) => (
              <button
                key={league.value}
                onClick={() => onLeagueChange(league.value)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  selectedLeague === league.value
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                )}
              >
                {league.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div className="relative flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            {quickDates.map((date) => (
              <button
                key={date.label}
                onClick={() => onDateChange(date.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  selectedDate === date.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {date.label}
              </button>
            ))}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-md border bg-background px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* Live Only Toggle */}
        <button
          onClick={() => onLiveOnlyChange(!liveOnly)}
          className={cn(
            "ml-auto flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            liveOnly
              ? "bg-success text-success-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          <Play className="h-4 w-4" />
          Live Only
        </button>
      </div>

      {/* Second Row: Market Tabs + Search */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Market Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {markets.map((market) => (
            <button
              key={market.value}
              onClick={() => onMarketChange(market.value as any)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                selectedMarket === market.value
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              {market.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border bg-background py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
