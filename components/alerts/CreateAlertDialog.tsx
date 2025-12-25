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
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Bell, TrendingUp, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AlertType = "odds_move" | "line_cross" | "game_start";

export function CreateAlertDialog({
  open,
  onOpenChange,
}: CreateAlertDialogProps) {
  const [alertType, setAlertType] = useState<AlertType>("odds_move");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO: Implement alert creation API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    onOpenChange(false);
  };

  const alertTypes = [
    {
      value: "odds_move" as AlertType,
      label: "Odds Movement",
      icon: TrendingUp,
      description: "Alert when odds move by a threshold",
    },
    {
      value: "line_cross" as AlertType,
      label: "Line Crosses Value",
      icon: Target,
      description: "Alert when line crosses a specific value",
    },
    {
      value: "game_start" as AlertType,
      label: "Game Start Reminder",
      icon: Clock,
      description: "Reminder before game starts",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Create Alert
          </DialogTitle>
          <DialogDescription>
            Get notified about odds movements and game events
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Alert Type Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium">Alert Type</label>
            <div className="grid gap-3">
              {alertTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAlertType(type.value)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-colors",
                      alertType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{type.label}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Game Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Game (Optional)
            </label>
            <Input
              type="text"
              placeholder="Search for a game..."
              className="w-full"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Leave empty to apply to all games
            </p>
          </div>

          {/* Market Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium">Market</label>
            <div className="flex gap-2">
              <Badge variant="secondary" className="cursor-pointer">
                Moneyline
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Spread
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                Total
              </Badge>
            </div>
          </div>

          {/* Conditional Fields */}
          {alertType === "odds_move" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Movement Threshold
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="threshold"
                  min="1"
                  max="100"
                  defaultValue="10"
                  className="w-32"
                  required
                />
                <span className="text-sm text-muted-foreground">points</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Alert when odds move by this amount
              </p>
            </div>
          )}

          {alertType === "line_cross" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Target Line Value
              </label>
              <Input
                type="number"
                name="targetValue"
                step="0.5"
                placeholder="-7.5"
                className="w-32"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Alert when line crosses this value
              </p>
            </div>
          )}

          {alertType === "game_start" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Reminder Time
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  name="reminderMinutes"
                  min="5"
                  max="120"
                  defaultValue="30"
                  className="w-32"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  minutes before
                </span>
              </div>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit} loading={submitting}>
            Create Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
