"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Moon, Sun, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const [selectedLeague, setSelectedLeague] = useState<"NFL" | "NBA">("NFL");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Left: Logo + League Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              S
            </div>
            <span className="hidden text-xl font-bold sm:inline-block">
              Sports AI
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-lg bg-muted p-1 md:flex">
            <button
              onClick={() => setSelectedLeague("NFL")}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                selectedLeague === "NFL"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              NFL
            </button>
            <button
              onClick={() => setSelectedLeague("NBA")}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                selectedLeague === "NBA"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              )}
            >
              NBA
            </button>
          </div>
        </div>

        {/* Right: Search, Date, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="hidden md:inline-flex"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Date Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden gap-2 md:inline-flex">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Today</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>Tomorrow</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>Custom Range...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
