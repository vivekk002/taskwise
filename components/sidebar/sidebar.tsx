"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Clock,
  Timer,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: "/dashboard/tasks",
    color: "text-violet-500",
  },
  {
    label: "Focus Timer",
    icon: Timer,
    href: "/dashboard/focus",
    color: "text-pink-700",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    color: "text-orange-700",
  },
  {
    label: "Sessions",
    icon: Clock,
    href: "/dashboard/sessions",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen w-64 glass border-r border-border/50 flex flex-col transition-all duration-300",
        className
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            TaskWise
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                "hover:bg-primary/10 dark:hover:bg-white/10",
                isActive
                  ? "bg-primary/10 dark:bg-white/10 text-primary dark:text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-primary dark:hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary dark:bg-cyan-400 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              )}
              <route.icon
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-primary dark:text-cyan-400"
                    : "text-muted-foreground group-hover:text-primary dark:group-hover:text-slate-100"
                )}
              />
              <span className="font-medium">{route.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 TaskWise
            <br />
            <span className="opacity-50">v2.0.0 Neon</span>
          </p>
        </div>
      </div>
    </div>
  );
}
