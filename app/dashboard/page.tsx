"use client";

import React, { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActiveTimerWidget } from "@/components/dashboard/active-timer-widget";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { RecentSessions } from "@/components/dashboard/recent-sessions";
import { useSession } from "next-auth/react";

interface DashboardData {
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
  todaysTasks: any[];
  upcomingTasks: any[];
  recentSessions: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {greeting()}, {session?.user?.name || "there"}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Here's what's happening with your tasks today
        </p>
      </div>

      {/* Active Timer Widget */}
      <ActiveTimerWidget />

      {/* Stats Cards */}
      <StatsCards stats={data.stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysTasks tasks={data.todaysTasks} />
        <UpcomingDeadlines tasks={data.upcomingTasks} />
      </div>

      {/* Recent Sessions */}
      <RecentSessions sessions={data.recentSessions} />
    </div>
  );
}
