"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Bell, AlertCircle } from "lucide-react";

interface StatsRailProps {
  gameId: string;
  stats?: {
    baselineWinProb?: number;
    edge?: number;
    confidence?: "Very Low" | "Low" | "Medium" | "High" | "Very High";
    dataFreshness?: "Current" | "Recent" | "Stale";
  };
  onCreateAlert?: () => void;
}

export function StatsRail({ gameId, stats, onCreateAlert }: StatsRailProps) {
  const getConfidenceBadge = (
    confidence?: "Very Low" | "Low" | "Medium" | "High" | "Very High"
  ) => {
    switch (confidence) {
      case "Very High":
        return <Badge variant="success">Very High</Badge>;
      case "High":
        return <Badge variant="success">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="warning">Low</Badge>;
      case "Very Low":
        return <Badge variant="outline">Very Low</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getFreshnessColor = (freshness?: string) => {
    switch (freshness) {
      case "Current":
        return "text-success";
      case "Recent":
        return "text-warning";
      case "Stale":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {/* Key Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Baseline Win Probability */}
          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Baseline Win Prob
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {stats?.baselineWinProb !== undefined
                ? `${(stats.baselineWinProb * 100).toFixed(1)}%`
                : "-"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Market-derived probability
            </div>
          </div>

          {/* Edge Metric */}
          <div className="border-t pt-4">
            <div className="mb-1 text-xs text-muted-foreground">
              Edge Metric
            </div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                stats?.edge && stats.edge > 0
                  ? "text-success"
                  : stats?.edge && stats.edge < 0
                    ? "text-destructive"
                    : ""
              }`}
            >
              {stats?.edge !== undefined
                ? `${stats.edge > 0 ? "+" : ""}${(stats.edge * 100).toFixed(1)}%`
                : "-"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Model vs implied probability
            </div>
          </div>

          {/* Confidence Tier */}
          <div className="border-t pt-4">
            <div className="mb-2 text-xs text-muted-foreground">
              Confidence Tier
            </div>
            {getConfidenceBadge(stats?.confidence)}
          </div>

          {/* Data Freshness */}
          <div className="border-t pt-4">
            <div className="mb-1 text-xs text-muted-foreground">
              Data Freshness
            </div>
            <div
              className={`text-sm font-medium ${getFreshnessColor(stats?.dataFreshness)}`}
            >
              {stats?.dataFreshness || "-"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Alert Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get notified when odds move or game starts
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onCreateAlert}
          >
            <Bell className="mr-2 h-3.5 w-3.5" />
            Create Alert
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer Card */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-warning" />
            <div className="space-y-1 text-xs">
              <p className="font-medium text-warning-foreground">
                Analytics Only
              </p>
              <p className="text-muted-foreground">
                All metrics are for educational and analytical purposes. Not
                financial or betting advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
