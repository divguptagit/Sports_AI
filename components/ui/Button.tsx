"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "default" | "destructive" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon" | "default";
  loading?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Map new variants to old ones for compatibility
  const mappedVariant = variant === "default" ? "primary" : variant === "destructive" ? "danger" : variant;
  const isButtonLoading = loading || isLoading;
  
  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border-2 border-input text-foreground hover:bg-accent hover:text-accent-foreground",
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const mappedSize = size === "default" ? "md" : size;
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm h-9",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-11",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center",
        variantClasses[mappedVariant as keyof typeof variantClasses] || variantClasses.primary,
        sizeClasses[mappedSize as keyof typeof sizeClasses],
        className
      )}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {isButtonLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
