"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface AnalyticsStatsProps {
  stats: {
    totalFocusTime: number;
    totalSessions: number;
    averageSessionDuration: number;
    thisWeekTime: number;
    lastWeekTime: number;
    weekChange: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const cards = [
    {
      title: "Total Focus Time",
      value: formatTime(stats.totalFocusTime),
      subtitle: `${stats.totalSessions} sessions`,
      icon: Clock,
      color: "bg-foreground",
      bgColor: "bg-card",
    },
    {
      title: "This Week",
      value: formatTime(stats.thisWeekTime),
      subtitle: (
        <span className="flex items-center gap-1">
          {stats.weekChange >= 0 ? (
            <TrendingUp className="w-3 h-3 text-foreground" />
          ) : (
            <TrendingDown className="w-3 h-3 text-muted-foreground" />
          )}
          <span
            className={
              stats.weekChange >= 0
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            {Math.abs(stats.weekChange).toFixed(1)}% vs last week
          </span>
        </span>
      ),
      icon: Zap,
      color: "bg-foreground",
      bgColor: "bg-card",
    },
    {
      title: "Avg Session",
      value: formatTime(stats.averageSessionDuration),
      subtitle: "per focus session",
      icon: Target,
      color: "bg-foreground",
      bgColor: "bg-card",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate.toFixed(1)}%`,
      subtitle: `${stats.completedTasks}/${stats.totalTasks} tasks`,
      icon: CheckCircle2,
      color: "bg-foreground",
      bgColor: "bg-card",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`${card.bgColor} glass border-border/50 p-6`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {card.value}
              </h3>
              <div className="text-xs text-muted-foreground">
                {card.subtitle}
              </div>
            </div>
            <div
              className={`${card.color} p-3 rounded-lg shadow-lg shadow-primary/10`}
            >
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
