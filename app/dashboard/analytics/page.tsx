"use client";

import React, { useEffect, useState } from "react";
import { AnalyticsStats } from "@/components/analytics/analytics-stats";
import { FocusTimeChart } from "@/components/analytics/focus-time-chart";
import { HourlyActivityChart } from "@/components/analytics/hourly-activity-chart";
import { TopTasksList } from "@/components/analytics/top-tasks-list";

interface AnalyticsData {
  stats: {
    totalFocusTime: number;
    totalSessions: number;
    averageSessionDuration: number;
    thisWeekTime: number;
    lastWeekTime: number;
    weekChange: number;
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    completionRate: number;
    priorityStats: {
      high: number;
      medium: number;
      low: number;
    };
  };
  dailyData: Array<{
    date: string;
    hours: number;
    minutes: number;
  }>;
  hourlyData: Array<{
    hour: number;
    label: string;
    minutes: number;
  }>;
  topTasks: Array<{
    id: string;
    title: string;
    priority: string | null;
    hours: number;
    minutes: number;
    sessionCount: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const analyticsData = await res.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics & Insights 📊
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track your productivity and focus patterns
        </p>
      </div>

      {/* Stats Cards */}
      <AnalyticsStats stats={data.stats} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <FocusTimeChart data={data.dailyData} />
        </div>
        <HourlyActivityChart data={data.hourlyData} />
        <TopTasksList tasks={data.topTasks} />
      </div>
    </div>
  );
}
