"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label?: string;
  };
  icon?: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
  trend?: "up" | "down" | "neutral";
}

export function PremiumStatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  trend,
}: PremiumStatCardProps) {
  const variants = {
    default: {
      bg: "bg-card",
      text: "text-foreground",
      border: "border-border",
    },
    success: {
      bg: "bg-gradient-to-br from-success/10 to-success/5",
      text: "text-success",
      border: "border-success/20",
    },
    danger: {
      bg: "bg-gradient-to-br from-danger/10 to-danger/5",
      text: "text-danger",
      border: "border-danger/20",
    },
    warning: {
      bg: "bg-gradient-to-br from-warning/10 to-warning/5",
      text: "text-warning",
      border: "border-warning/20",
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "hover:shadow-soft-lg group relative overflow-hidden rounded-2xl border p-6 transition-all duration-200",
        config.bg,
        config.border
      )}
    >
      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5 blur-2xl transition-all duration-300 group-hover:bg-primary/10" />

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          {Icon && (
            <div
              className={cn(
                "rounded-lg p-2 transition-colors",
                variant === "default"
                  ? "bg-primary/10 text-primary"
                  : `${config.bg} ${config.text}`
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Value */}
        <div className={cn("display-number text-3xl font-bold", config.text)}>
          {value}
        </div>

        {/* Change indicator */}
        {change && (
          <div className="flex items-center gap-1 text-sm">
            {trend === "up" && (
              <span className="text-success">↑ {Math.abs(change.value)}%</span>
            )}
            {trend === "down" && (
              <span className="text-danger">↓ {Math.abs(change.value)}%</span>
            )}
            {trend === "neutral" && (
              <span className="text-muted-foreground">→ {change.value}%</span>
            )}
            {change.label && (
              <span className="text-muted-foreground">{change.label}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
