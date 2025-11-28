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
    <Card className="p-6 glass border-white/5 bg-slate-900/40">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">
        Daily Task Overview
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-slate-800"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              className="text-xs text-slate-500"
              tick={{ fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              className="text-xs text-slate-500"
              tick={{ fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "#e2e8f0",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
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
