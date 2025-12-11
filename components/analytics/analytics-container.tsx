"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsStatsCard } from "./analytics-stats-card";

type ViewType = "daily" | "weekly" | "monthly";
type ChartType = "line" | "bar";

interface DailyData {
  date: string;
  hours: number;
  minutes: number;
  sessions: number;
}

export function AnalyticsContainer() {
  const [view, setView] = useState<ViewType>("daily");
  const [chartType, setChartType] = useState<ChartType>("line");

  // Mock data for now - will be replaced with real API call
  const overviewData = {
    today: { hours: 3, minutes: 45 },
    week: { hours: 18, minutes: 30 },
    month: { hours: 72, minutes: 15 },
    totalSessions: 45,
    avgSessionMinutes: 35,
    mostFocusedTask: { title: "Project Planning" },
    topTasks: [
      { title: "Project Planning", hours: 5, minutes: 30 },
      { title: "Code Review", hours: 4, minutes: 15 },
      { title: "Documentation", hours: 3, minutes: 45 },
    ],
  };

  const chartData: DailyData[] = useMemo(() => {
    const days: DailyData[] = [];

    if (view === "daily") {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          hours: Math.floor(Math.random() * 6) + 1,
          minutes: Math.floor(Math.random() * 60),
          sessions: Math.floor(Math.random() * 8) + 1,
        });
      }
    } else if (view === "weekly") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        days.push({
          date: `Week ${4 - i}`,
          hours: Math.floor(Math.random() * 30) + 10,
          minutes: Math.floor(Math.random() * 60),
          sessions: Math.floor(Math.random() * 35) + 10,
        });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        days.push({
          date: date.toLocaleDateString("en-US", { month: "short" }),
          hours: Math.floor(Math.random() * 100) + 40,
          minutes: Math.floor(Math.random() * 60),
          sessions: Math.floor(Math.random() * 150) + 50,
        });
      }
    }

    return days;
  }, [view]);

  const taskBreakdown = useMemo(() => {
    const colors = [
      "hsl(var(--foreground))",
      "hsl(var(--muted-foreground))",
      "hsl(var(--border))",
      "hsl(var(--secondary-foreground))",
      "hsl(var(--primary))",
    ];
    return (
      overviewData?.topTasks?.map((task: any, idx: number) => ({
        name: task.title,
        value: task.hours * 60 + task.minutes,
        fill: colors[idx % colors.length],
      })) || []
    );
  }, [overviewData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-foreground">Focus Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Detailed insights into your productivity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStatsCard
          title="Today's Focus"
          hours={overviewData?.today?.hours ?? 0}
          minutes={overviewData?.today?.minutes ?? 0}
          icon="🔥"
          color=""
        />
        <AnalyticsStatsCard
          title="This Week"
          hours={overviewData?.week?.hours ?? 0}
          minutes={overviewData?.week?.minutes ?? 0}
          icon="📊"
          color=""
        />
        <AnalyticsStatsCard
          title="This Month"
          hours={overviewData?.month?.hours ?? 0}
          minutes={overviewData?.month?.minutes ?? 0}
          icon="🎯"
          color=""
        />
      </div>

      {/* Controls */}
      <Card className="p-6 bg-card">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              View
            </label>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly"] as const).map((v) => (
                <Button
                  key={v}
                  variant={view === v ? "default" : "outline"}
                  onClick={() => setView(v)}
                  className="capitalize"
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Chart Type
            </label>
            <div className="flex gap-2">
              {(["line", "bar"] as const).map((c) => (
                <Button
                  key={c}
                  variant={chartType === c ? "default" : "outline"}
                  onClick={() => setChartType(c)}
                  className="capitalize"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Chart */}
      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Focus Time Trends
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--foreground))" }}
                name="Hours"
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))" }}
                name="Sessions"
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend />
              <Bar
                dataKey="hours"
                fill="hsl(var(--foreground))"
                name="Hours"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="sessions"
                fill="hsl(var(--muted-foreground))"
                name="Sessions"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Breakdown */}
        <Card className="p-6 bg-card">
          <h3 className="text-xl font-bold text-foreground mb-6">Top Tasks</h3>
          {taskBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) =>
                    `${name}: ${Math.floor(value / 60)}h`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${Math.floor(value / 60)}h ${value % 60}m`
                  }
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No task data available
            </p>
          )}
        </Card>

        {/* Summary Stats */}
        <Card className="p-6 bg-card">
          <h3 className="text-xl font-bold text-foreground mb-6">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sessions</span>
              <span className="font-bold text-foreground">
                {overviewData?.totalSessions || 0}
              </span>
            </div>
            <div className="border-t border-border"></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Session</span>
              <span className="font-bold text-foreground">
                {overviewData?.avgSessionMinutes || 0}m
              </span>
            </div>
            <div className="border-t border-border"></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Most Focused Task</span>
              <span className="font-bold text-foreground truncate">
                {overviewData?.mostFocusedTask?.title || "N/A"}
              </span>
            </div>
            <div className="border-t border-border"></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-bold text-foreground">7 days 🔥</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
