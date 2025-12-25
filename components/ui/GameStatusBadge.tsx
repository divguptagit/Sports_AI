"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface GameStatusBadgeProps {
  status: string;
  className?: string;
}

export function GameStatusBadge({ status, className }: GameStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "IN_PROGRESS":
      case "LIVE":
        return {
          label: "Live",
          variant: "success" as const,
          className: "relative",
          showPulse: true,
        };
      case "FINAL":
      case "FINISHED":
        return {
          label: "Final",
          variant: "outline" as const,
        };
      case "SCHEDULED":
      case "UPCOMING":
        return {
          label: "Upcoming",
          variant: "secondary" as const,
        };
      case "POSTPONED":
        return {
          label: "Postponed",
          variant: "warning" as const,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          variant: "destructive" as const,
        };
      default:
        return {
          label: status,
          variant: "outline" as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      {config.showPulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-foreground opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success-foreground"></span>
        </span>
      )}
      {config.label}
    </Badge>
  );
}

