"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success:
          "border-transparent bg-success/15 text-success ring-1 ring-success/20 hover:bg-success/25",
        destructive:
          "border-transparent bg-destructive/15 text-destructive ring-1 ring-destructive/20 hover:bg-destructive/25",
        outline:
          "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
        warning:
          "border-transparent bg-warning/15 text-warning ring-1 ring-warning/20 hover:bg-warning/25",
        live: "border-transparent bg-gradient-to-r from-success to-success/80 text-white shadow-glow-success animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PremiumBadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  pulse?: boolean;
}

function PremiumBadge({
  className,
  variant,
  pulse,
  children,
  ...props
}: PremiumBadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {pulse && variant === "live" && (
        <span className="mr-1.5 flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
      )}
      {children}
    </div>
  );
}

export { PremiumBadge, badgeVariants };
