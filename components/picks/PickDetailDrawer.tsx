"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Clock,
  Trophy,
} from "lucide-react";

interface Pick {
  id: string;
  date: string;
  game: {
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

interface PickDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pick: Pick | null;
}

export function PickDetailDrawer({
  open,
  onOpenChange,
  pick,
}: PickDetailDrawerProps) {
  if (!pick) return null;

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Simulated Pick Details</SheetTitle>
          <SheetDescription>
            Full information for this tracked prediction
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Result Status */}
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="mt-1">{getResultBadge(pick.result)}</div>
              </div>
              {pick.profit !== undefined && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Profit/Loss
                  </div>
                  <div
                    className={`mt-1 text-2xl font-bold ${
                      pick.profit >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {pick.profit >= 0 ? "+" : ""}
                    {pick.profit.toFixed(2)} units
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Info */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Trophy className="h-4 w-4" />
              Game
            </h3>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-semibold">
                  {pick.game.awayTeam} @ {pick.game.homeTeam}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(pick.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pick Details */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4" />
              Pick Details
            </h3>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Market</div>
                    <div className="mt-1 font-medium">{pick.market}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Side</div>
                    <div className="mt-1 font-medium">{pick.side}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Odds</div>
                    <div className="mt-1 font-mono font-medium">
                      {formatOdds(pick.odds)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Units</div>
                    <div className="mt-1 font-medium">{pick.units}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </h3>
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Implied Probability
                    </div>
                    <div className="mt-1 font-medium">
                      {pick.impliedProbability
                        ? `${pick.impliedProbability.toFixed(1)}%`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Edge</div>
                    <div
                      className={`mt-1 font-medium ${
                        pick.edge && pick.edge > 0
                          ? "text-success"
                          : pick.edge && pick.edge < 0
                            ? "text-destructive"
                            : ""
                      }`}
                    >
                      {pick.edge !== undefined
                        ? `${pick.edge >= 0 ? "+" : ""}${pick.edge.toFixed(1)}%`
                        : "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {pick.notes && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{pick.notes}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4" />
              Timeline
            </h3>
            <Card>
              <CardContent className="space-y-3 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(pick.createdAt).toLocaleString()}
                  </span>
                </div>
                {pick.settledAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settled</span>
                    <span className="font-medium">
                      {new Date(pick.settledAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4 text-xs text-muted-foreground">
              <p className="font-medium text-warning-foreground">
                Simulated Tracking Only
              </p>
              <p className="mt-1">
                This is for analytical and educational purposes. Not real money
                betting or financial advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
