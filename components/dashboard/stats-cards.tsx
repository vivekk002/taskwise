"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    overdueTasks: number;
    todayTasks: number;
    todayCompleted: number;
    todayFocusTime: number;
    weekFocusTime: number;
    totalSessions: number;
    completionRate: number;
    completedChange: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const cards = [
    {
      title: "Tasks Completed",
      value: stats.completedTasks,
      subtitle:
        stats.completedChange !== 0
          ? `${stats.completedChange > 0 ? "↗" : "↘"} ${Math.abs(
              stats.completedChange
            )}% from yesterday`
          : "No change from yesterday",
      icon: CheckCircle2,
      color: "blue",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      textColor: "text-blue-500 dark:text-blue-400",
      href: "/dashboard/tasks?filter=completed",
    },
    {
      title: "Pending Tasks",
      value: stats.activeTasks,
      subtitle: `Due within 24h: ${stats.todayTasks}`,
      icon: Timer,
      color: "amber",
      borderColor: "border-amber-500/30",
      glowColor: "shadow-amber-500/20",
      textColor: "text-amber-500 dark:text-amber-400",
      href: "/dashboard/tasks?filter=active",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      subtitle: stats.overdueTasks > 0 ? "Action required" : "All caught up!",
      icon: AlertCircle,
      color: "rose",
      borderColor: "border-rose-500/30",
      glowColor: "shadow-rose-500/20",
      textColor: "text-rose-500 dark:text-rose-400",
      href: "/dashboard/tasks?filter=overdue",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Link key={index} href={card.href} className="cursor-pointer">
          <Card
            className={cn(
              "p-6 glass border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group",
              "bg-card/50 backdrop-blur-sm border-border/50",
              `hover:${card.borderColor} hover:shadow-xl ${card.glowColor}`
            )}
          >
            {/* Top Glow Line */}
            <div
              className={cn(
                "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity duration-500",
                card.color === "blue" && "from-blue-600 to-blue-400",
                card.color === "amber" && "from-amber-600 to-amber-400",
                card.color === "rose" && "from-rose-600 to-rose-400"
              )}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "p-2.5 rounded-xl bg-secondary/50 transition-colors group-hover:bg-background",
                    card.textColor
                  )}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </p>
              </div>

              <h3 className="text-4xl font-bold text-foreground mb-2 tracking-tighter">
                {card.value}
              </h3>
              <p
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  card.color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground"
                )}
              >
                {card.subtitle}
              </p>
            </div>

            {/* Background Glow */}
            <div
              className={cn(
                "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 ease-out",
                card.color === "blue" && "bg-blue-500",
                card.color === "amber" && "bg-amber-500",
                card.color === "rose" && "bg-rose-500"
              )}
            />
          </Card>
        </Link>
      ))}
    </div>
  );
}
