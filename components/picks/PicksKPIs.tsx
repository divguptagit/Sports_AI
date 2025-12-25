"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Target, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface PicksKPIsProps {
  stats: {
    totalUnits: number;
    roi: number;
    winRate: number;
    avgEdge: number;
    last7Days: {
      units: number;
      change: number;
    };
  };
}

export function PicksKPIs({ stats }: PicksKPIsProps) {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    variant,
  }: {
    title: string;
    value: string;
    icon: any;
    variant: "success" | "danger" | "default";
  }) => (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        variant === "success" && "border-success/50",
        variant === "danger" && "border-destructive/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-3xl font-bold tracking-tight",
            variant === "success" && "text-success",
            variant === "danger" && "text-destructive"
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Units"
        value={
          stats.totalUnits >= 0
            ? `+${stats.totalUnits.toFixed(2)}`
            : stats.totalUnits.toFixed(2)
        }
        icon={Target}
        variant={stats.totalUnits >= 0 ? "success" : "danger"}
      />
      <StatCard
        title="ROI"
        value={`${stats.roi >= 0 ? "+" : ""}${stats.roi.toFixed(1)}%`}
        icon={stats.roi >= 0 ? TrendingUp : TrendingDown}
        variant={stats.roi >= 0 ? "success" : "danger"}
      />
      <StatCard
        title="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        icon={Target}
        variant={stats.winRate >= 50 ? "success" : "default"}
      />
      <StatCard
        title="Avg Edge"
        value={`${stats.avgEdge >= 0 ? "+" : ""}${stats.avgEdge.toFixed(1)}%`}
        icon={Zap}
        variant={stats.avgEdge >= 0 ? "success" : "default"}
      />
      <StatCard
        title="Last 7 Days"
        value={
          stats.last7Days.units >= 0
            ? `+${stats.last7Days.units.toFixed(2)}`
            : stats.last7Days.units.toFixed(2)
        }
        icon={Calendar}
        variant={stats.last7Days.units >= 0 ? "success" : "danger"}
      />
    </div>
  );
}
