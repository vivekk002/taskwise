"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Clock,
  Timer,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserLevelWidget } from "@/components/gamification/user-level-widget";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-foreground",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: "/dashboard/tasks",
    color: "text-foreground",
  },
  {
    label: "Focus Timer",
    icon: Timer,
    href: "/dashboard/focus",
    color: "text-foreground",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
    color: "text-foreground",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-foreground",
  },
  {
    label: "Sessions",
    icon: Clock,
    href: "/dashboard/sessions",
    color: "text-foreground",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-foreground",
  },
];

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen glass border-r border-primary/5 flex flex-col transition-all duration-300 bg-gradient-to-b from-background via-background to-secondary/10",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "p-6 border-b border-border/50 flex items-center",
          isCollapsed ? "justify-center p-4" : "gap-3"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 shrink-0">
            <CheckSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-foreground animate-fade-in">
              TaskWise
            </h1>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-primary/10 text-primary shadow-lg shadow-primary/20 ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? route.label : undefined}
            >
              {isActive && (
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)] rounded-r-full transition-all duration-300",
                    isCollapsed ? "left-0 top-2 bottom-2" : "left-0"
                  )}
                />
              )}
              <route.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0",
                  isActive
                    ? "text-primary drop-shadow-sm"
                    : "text-muted-foreground group-hover:text-primary"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium animate-fade-in truncate relative z-10">
                  {route.label}
                </span>
              )}

              {/* Subtle hover glow */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <UserLevelWidget />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div
          className={cn(
            "rounded-xl bg-secondary/50 border border-border/50 transition-all",
            isCollapsed ? "p-2 flex justify-center" : "p-4"
          )}
        >
          {isCollapsed ? (
            <span className="text-[10px] font-mono text-muted-foreground">
              v2
            </span>
          ) : (
            <p className="text-xs text-muted-foreground text-center animate-fade-in">
              © 2025 TaskWise
              <br />
              <span className="opacity-50">v2.0.0 Neon</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
