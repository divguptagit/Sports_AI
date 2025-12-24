"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  delta,
  icon,
  className,
}: StatCardProps) {
  const getDeltaColor = () => {
    if (!delta) return "";
    if (delta.value > 0) return "text-success";
    if (delta.value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getDeltaIcon = () => {
    if (!delta) return null;
    if (delta.value > 0) return <ArrowUp className="h-3 w-3" />;
    if (delta.value < 0) return <ArrowDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {delta && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              getDeltaColor()
            )}
          >
            {getDeltaIcon()}
            <span>
              {Math.abs(delta.value)}%{delta.label && ` ${delta.label}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
