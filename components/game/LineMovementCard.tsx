"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import OddsMovementChart from "@/components/charts/OddsMovementChart";

interface LineMovementCardProps {
  gameId: string;
  market: "ML" | "SPREAD" | "TOTAL";
}

export function LineMovementCard({ gameId, market }: LineMovementCardProps) {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "all">(
    "24h"
  );

  const timeRanges = [
    { value: "1h", label: "1H" },
    { value: "6h", label: "6H" },
    { value: "24h", label: "24H" },
    { value: "all", label: "All" },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Line Movement</CardTitle>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                  timeRange === range.value
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          Line movement chart will display odds history over time
        </div>
      </CardContent>
    </Card>
  );
}
