"use client";

import { Badge } from "@/components/ui/Badge";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  game: {
    homeTeam: { abbr: string; name: string; city: string };
    awayTeam: { abbr: string; name: string; city: string };
    startTime: string;
    status: string;
    homeScore?: number;
    awayScore?: number;
    venue?: string;
  };
  homeRecord?: string;
  awayRecord?: string;
}

export function GameHeader({ game, homeRecord, awayRecord }: GameHeaderProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isLive = game.status === "IN_PROGRESS";
  const isFinal = game.status === "FINAL";
  const hasScore = game.homeScore !== undefined && game.awayScore !== undefined;

  return (
    <div className="rounded-lg border bg-card p-8 shadow-sm">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive ? (
              <Badge variant="success" className="gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-foreground opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success-foreground"></span>
                </span>
                Live
              </Badge>
            ) : isFinal ? (
              <Badge variant="outline">Final</Badge>
            ) : (
              <Badge variant="secondary">Scheduled</Badge>
            )}
            {game.venue && (
              <span className="text-sm text-muted-foreground">
                {game.venue}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatTime(game.startTime)}
          </div>
        </div>

        {/* Teams & Scores */}
        <div className="grid grid-cols-2 gap-8">
          {/* Away Team */}
          <div
            className={cn(
              "space-y-3",
              hasScore && game.awayScore! > game.homeScore! && "opacity-100",
              hasScore && game.awayScore! < game.homeScore! && "opacity-60"
            )}
          >
            <div className="text-sm font-medium text-muted-foreground">
              Away
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{game.awayTeam.abbr}</div>
                <div className="text-sm text-muted-foreground">
                  {game.awayTeam.city} {game.awayTeam.name}
                </div>
                {awayRecord && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {awayRecord}
                  </div>
                )}
              </div>
              {hasScore && (
                <div className="text-5xl font-bold tabular-nums">
                  {game.awayScore}
                </div>
              )}
            </div>
          </div>

          {/* Home Team */}
          <div
            className={cn(
              "space-y-3",
              hasScore && game.homeScore! > game.awayScore! && "opacity-100",
              hasScore && game.homeScore! < game.awayScore! && "opacity-60"
            )}
          >
            <div className="text-sm font-medium text-muted-foreground">
              Home
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{game.homeTeam.abbr}</div>
                <div className="text-sm text-muted-foreground">
                  {game.homeTeam.city} {game.homeTeam.name}
                </div>
                {homeRecord && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {homeRecord}
                  </div>
                )}
              </div>
              {hasScore && (
                <div className="text-5xl font-bold tabular-nums">
                  {game.homeScore}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">vs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
