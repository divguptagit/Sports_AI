"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePickModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: {
    homeTeam: { abbr: string };
    awayTeam: { abbr: string };
  };
  market: "ML" | "SPREAD" | "TOTAL";
  odds?: {
    homeOdds?: number;
    awayOdds?: number;
    overOdds?: number;
    underOdds?: number;
    line?: number;
  };
}

export function CreatePickModal({
  open,
  onOpenChange,
  game,
  market,
  odds,
}: CreatePickModalProps) {
  const [side, setSide] = useState<string>("");
  const [units, setUnits] = useState("1");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const calculateImpliedProbability = (americanOdds: number) => {
    if (americanOdds > 0) {
      return (100 / (americanOdds + 100)) * 100;
    } else {
      return (Math.abs(americanOdds) / (Math.abs(americanOdds) + 100)) * 100;
    }
  };

  const getSideOptions = () => {
    if (market === "ML") {
      return [
        {
          value: "away",
          label: game.awayTeam.abbr,
          odds: odds?.awayOdds,
        },
        {
          value: "home",
          label: game.homeTeam.abbr,
          odds: odds?.homeOdds,
        },
      ];
    } else if (market === "SPREAD") {
      return [
        {
          value: "away",
          label: `${game.awayTeam.abbr} ${odds?.line ? `(${odds.line > 0 ? "+" : ""}${odds.line})` : ""}`,
          odds: odds?.awayOdds,
        },
        {
          value: "home",
          label: `${game.homeTeam.abbr} ${odds?.line ? `(${-odds.line > 0 ? "+" : ""}${-odds.line})` : ""}`,
          odds: odds?.homeOdds,
        },
      ];
    } else {
      return [
        {
          value: "over",
          label: `Over ${odds?.line || "-"}`,
          odds: odds?.overOdds,
        },
        {
          value: "under",
          label: `Under ${odds?.line || "-"}`,
          odds: odds?.underOdds,
        },
      ];
    }
  };

  const sideOptions = getSideOptions();
  const selectedSideData = sideOptions.find((s) => s.value === side);
  const selectedOdds = selectedSideData?.odds;
  const impliedProb = selectedOdds
    ? calculateImpliedProbability(selectedOdds)
    : null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // TODO: Implement pick creation API call
      console.log("Creating pick:", { side, units, notes, market, odds });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create pick:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Track Simulated Pick
          </DialogTitle>
          <DialogDescription>
            Record your analytical prediction for tracking purposes only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Disclaimer */}
          <div className="flex gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-warning-foreground">
                Simulated Tracking Only
              </p>
              <p className="text-muted-foreground">
                This is for analytical purposes. Not real money betting or
                financial advice.
              </p>
            </div>
          </div>

          {/* Market & Side Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Market & Side
            </label>
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">
                {market === "ML"
                  ? "Moneyline"
                  : market === "SPREAD"
                    ? "Spread"
                    : "Total"}
              </Badge>
              <div className="grid grid-cols-2 gap-2">
                {sideOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSide(option.value)}
                    className={cn(
                      "rounded-lg border-2 p-4 text-left transition-colors",
                      side === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.odds && (
                      <div className="mt-1 font-mono text-sm text-muted-foreground">
                        {option.odds > 0 ? "+" : ""}
                        {option.odds}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Implied Probability */}
          {impliedProb && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Implied Probability
                </span>
                <span className="font-mono text-lg font-semibold">
                  {impliedProb.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Based on odds at time of pick
              </div>
            </div>
          )}

          {/* Units */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Units (Simulated)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.5"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your reasoning or analysis..."
              rows={3}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!side || !units}
          >
            Track Pick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
