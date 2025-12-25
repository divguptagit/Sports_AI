"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Bell,
  BookOpen,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Slate",
    href: "/slate",
    icon: LayoutDashboard,
  },
  {
    title: "Game",
    href: "/game",
    icon: BarChart3,
    disabled: true, // Dynamic route
  },
  {
    title: "Picks",
    href: "/picks",
    icon: Target,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
  {
    title: "Learn",
    href: "/learn",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl md:flex">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "pointer-events-none opacity-50"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-3 text-xs ring-1 ring-primary/20">
          <p className="mb-1 font-semibold text-primary">Analytics Only</p>
          <p className="text-muted-foreground">
            For educational purposes. Not betting advice.
          </p>
        </div>
      </div>
    </aside>
  );
}
