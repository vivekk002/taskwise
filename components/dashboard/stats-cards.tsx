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
      title: "Today's Focus",
      value: formatTime(stats.todayFocusTime),
      subtitle: `${stats.totalSessions} sessions`,
      icon: Timer,
      color: "bg-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Tasks Today",
      value: `${stats.todayCompleted}/${stats.todayTasks}`,
      subtitle:
        stats.todayTasks > 0
          ? `${Math.round(
              (stats.todayCompleted / stats.todayTasks) * 100
            )}% complete`
          : "No tasks",
      icon: Target,
      color: "bg-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      subtitle: `${stats.completedTasks}/${stats.totalTasks} tasks`,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Active Tasks",
      value: stats.activeTasks,
      subtitle:
        stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : "On track",
      icon: stats.overdueTasks > 0 ? AlertCircle : CheckCircle2,
      color: stats.overdueTasks > 0 ? "bg-red-500" : "bg-emerald-500",
      bgColor:
        stats.overdueTasks > 0
          ? "bg-red-50 dark:bg-red-950/30"
          : "bg-emerald-50 dark:bg-emerald-950/30",
      textColor:
        stats.overdueTasks > 0
          ? "text-red-600 dark:text-red-400"
          : "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`${card.bgColor} border-none p-6 transition-all hover:shadow-lg`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                {card.title}
              </p>
              <h3 className={`text-3xl font-bold ${card.textColor} mb-1`}>
                {card.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {card.subtitle}
              </p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
