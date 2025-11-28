"use client";

import React from "react";
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
      subtitle: `↗ +15% today`,
      icon: CheckCircle2,
      color: "blue",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      title: "Pending Tasks",
      value: stats.activeTasks,
      subtitle: `Due within 24h: ${stats.todayTasks}`,
      icon: Timer,
      color: "amber",
      borderColor: "border-amber-500/30",
      glowColor: "shadow-amber-500/20",
      textColor: "text-amber-400",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdueTasks,
      subtitle: "Action required",
      icon: AlertCircle,
      color: "red",
      borderColor: "border-red-500/30",
      glowColor: "shadow-red-500/20",
      textColor: "text-red-400",
    },
    {
      title: "Efficiency",
      value: `${stats.completionRate}%`,
      subtitle: "Based on activity",
      icon: TrendingUp,
      color: "cyan",
      borderColor: "border-cyan-500/30",
      glowColor: "shadow-cyan-500/20",
      textColor: "text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={cn(
            "p-6 glass border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group",
            "bg-card border-border/50",
            `hover:${card.borderColor} hover:shadow-lg ${card.glowColor}`
          )}
        >
          {/* Top Glow Line */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 group-hover:opacity-100 transition-opacity",
              card.color === "blue" && "from-blue-600 to-blue-400",
              card.color === "amber" && "from-amber-600 to-amber-400",
              card.color === "red" && "from-red-600 to-red-400",
              card.color === "cyan" && "from-cyan-600 to-cyan-400"
            )}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn("p-2 rounded-lg bg-secondary/50", card.textColor)}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
            </div>

            <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
              {card.value}
            </h3>
            <p
              className={cn(
                "text-xs font-medium",
                card.color === "blue"
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-muted-foreground"
              )}
            >
              {card.subtitle}
            </p>
          </div>

          {/* Background Glow */}
          <div
            className={cn(
              "absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500",
              card.color === "blue" && "bg-blue-500",
              card.color === "amber" && "bg-amber-500",
              card.color === "red" && "bg-red-500",
              card.color === "cyan" && "bg-cyan-500"
            )}
          />
        </Card>
      ))}
    </div>
  );
}
