<<<<<<< HEAD
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FocusHoursProps {
  todayFocusTime: number;
  dailyFocusData: Array<{ date: string; hours: number }>;
  weeklyFocusData: Array<{ week: string; hours: number }>;
  monthlyFocusData: Array<{ month: string; hours: number }>;
}

type TimeRange = "day" | "week" | "month";

export function FocusHours({
  todayFocusTime,
  dailyFocusData,
  weeklyFocusData,
  monthlyFocusData,
}: FocusHoursProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getData = () => {
    switch (timeRange) {
      case "day":
        return dailyFocusData;
      case "week":
        return weeklyFocusData;
      case "month":
        return monthlyFocusData;
      default:
        return dailyFocusData;
    }
  };

  const getDataKey = () => {
    switch (timeRange) {
      case "day":
        return "date";
      case "week":
        return "week";
      case "month":
        return "month";
      default:
        return "date";
    }
  };

  return (
    <Card className="p-6 glass border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Focus Hours
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary tracking-tighter">
              {formatTime(todayFocusTime)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">Today</p>
          </div>
        </div>

        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg border border-border/50">
          <Button
            variant={timeRange === "day" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("day")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "day" && "bg-background shadow-sm text-primary"
            )}
          >
            Day
          </Button>
          <Button
            variant={timeRange === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("week")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "week" && "bg-background shadow-sm text-primary"
            )}
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("month")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "month" && "bg-background shadow-sm text-primary"
            )}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getData()}
            margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border/30"
              vertical={false}
            />
            <XAxis
              dataKey={getDataKey()}
              className="text-xs text-muted-foreground font-medium"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs text-muted-foreground font-medium"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 12px",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
=======
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FocusHoursProps {
  todayFocusTime: number;
  dailyFocusData: Array<{ date: string; hours: number }>;
  weeklyFocusData: Array<{ week: string; hours: number }>;
  monthlyFocusData: Array<{ month: string; hours: number }>;
}

type TimeRange = "day" | "week" | "month";

export function FocusHours({
  todayFocusTime,
  dailyFocusData,
  weeklyFocusData,
  monthlyFocusData,
}: FocusHoursProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getData = () => {
    switch (timeRange) {
      case "day":
        return dailyFocusData;
      case "week":
        return weeklyFocusData;
      case "month":
        return monthlyFocusData;
      default:
        return dailyFocusData;
    }
  };

  const getDataKey = () => {
    switch (timeRange) {
      case "day":
        return "date";
      case "week":
        return "week";
      case "month":
        return "month";
      default:
        return "date";
    }
  };

  return (
    <Card className="p-6 glass border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              Focus Hours
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary tracking-tighter">
              {formatTime(todayFocusTime)}
            </p>
            <p className="text-xs font-medium text-muted-foreground">Today</p>
          </div>
        </div>

        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg border border-border/50">
          <Button
            variant={timeRange === "day" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("day")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "day" && "bg-background shadow-sm text-primary"
            )}
          >
            Day
          </Button>
          <Button
            variant={timeRange === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("week")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "week" && "bg-background shadow-sm text-primary"
            )}
          >
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("month")}
            className={cn(
              "cursor-pointer h-8 px-3 text-xs font-medium transition-all",
              timeRange === "month" && "bg-background shadow-sm text-primary"
            )}
          >
            Month
          </Button>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getData()}
            margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border/30"
              vertical={false}
            />
            <XAxis
              dataKey={getDataKey()}
              className="text-xs text-muted-foreground font-medium"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs text-muted-foreground font-medium"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                padding: "8px 12px",
              }}
              labelStyle={{
                color: "hsl(var(--foreground))",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
            />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
>>>>>>> origin/main
