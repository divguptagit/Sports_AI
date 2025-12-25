"use client";

import { useState, useCallback } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CreateAlertDialog } from "@/components/alerts/CreateAlertDialog";
import {
  Bell,
  Plus,
  TrendingUp,
  Clock,
  Target,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "odds_move" | "line_cross" | "game_start";
  game?: {
    homeTeam: string;
    awayTeam: string;
  };
  market: string;
  threshold?: number;
  targetValue?: number;
  reminderMinutes?: number;
  enabled: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export default function AlertsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "odds_move",
      game: { homeTeam: "Chiefs", awayTeam: "Bills" },
      market: "Moneyline",
      threshold: 10,
      enabled: true,
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      type: "game_start",
      game: { homeTeam: "Lakers", awayTeam: "Warriors" },
      market: "All",
      reminderMinutes: 30,
      enabled: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "line_cross",
      market: "Spread",
      targetValue: -7.5,
      enabled: false,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const handleToggleAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
      )
    );
  }, []);

  const handleDeleteAlert = useCallback((id: string) => {
    if (confirm("Are you sure you want to delete this alert?")) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "odds_move":
        return TrendingUp;
      case "line_cross":
        return Target;
      case "game_start":
        return Clock;
      default:
        return Bell;
    }
  };

  const getAlertLabel = (type: string) => {
    switch (type) {
      case "odds_move":
        return "Odds Movement";
      case "line_cross":
        return "Line Cross";
      case "game_start":
        return "Game Start";
      default:
        return type;
    }
  };

  const getAlertDescription = (alert: Alert) => {
    if (alert.type === "odds_move") {
      return `Alert when odds move by ${alert.threshold} points`;
    } else if (alert.type === "line_cross") {
      return `Alert when line crosses ${alert.targetValue}`;
    } else if (alert.type === "game_start") {
      return `Reminder ${alert.reminderMinutes} minutes before game`;
    }
    return "";
  };

  const formatLastTriggered = (date?: string) => {
    if (!date) return "Never";
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = now - then;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Alerts"
        description="Get notified about odds movements and game events"
        action={
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Alert
          </Button>
        }
      />

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Alerts
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {alerts.filter((a) => a.enabled).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Alerts
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recently Triggered
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {alerts.filter((a) => a.lastTriggered).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No alerts yet"
          message="Create your first alert to get notified about odds movements and game events."
          action={{
            label: "Create Alert",
            onClick: () => setCreateDialogOpen(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <Card
                key={alert.id}
                className={cn("transition-all", !alert.enabled && "opacity-60")}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "rounded-lg p-3",
                          alert.enabled
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {getAlertLabel(alert.type)}
                          </h3>
                          <Badge variant="secondary">{alert.market}</Badge>
                          {alert.enabled ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </div>
                        {alert.game && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {alert.game.awayTeam} @ {alert.game.homeTeam}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-muted-foreground">
                          {getAlertDescription(alert)}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Last triggered:{" "}
                            {formatLastTriggered(alert.lastTriggered)}
                          </span>
                          <span>•</span>
                          <span>
                            Created{" "}
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleAlert(alert.id)}
                        className="h-9 w-9"
                      >
                        {alert.enabled ? (
                          <ToggleRight className="h-5 w-5 text-success" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="h-9 w-9 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Alert Dialog */}
      <CreateAlertDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
