<<<<<<< HEAD
"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyOverviewChartProps {
  data: {
    date: string;
    completed: number;
  }[];
}

export function DailyOverviewChart({ data }: DailyOverviewChartProps) {
  return (
    <Card className="p-6 glass-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Daily Task Overview
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                      <p className="text-sm font-medium text-popover-foreground">
                        {payload[0].payload.date}
                      </p>
                      <p className="text-sm text-foreground font-semibold">
                        {payload[0].value} tasks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar
              dataKey="completed"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
=======
"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailyOverviewChartProps {
  data: {
    date: string;
    completed: number;
  }[];
}

export function DailyOverviewChart({ data }: DailyOverviewChartProps) {
  return (
    <Card className="p-6 glass-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Daily Task Overview
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--foreground))"
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs text-muted-foreground"
              tick={{ fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
                      <p className="text-sm font-medium text-popover-foreground">
                        {payload[0].payload.date}
                      </p>
                      <p className="text-sm text-foreground font-semibold">
                        {payload[0].value} tasks
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: "var(--muted)" }}
            />
            <Bar
              dataKey="completed"
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
>>>>>>> origin/main
