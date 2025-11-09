"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface FocusTimeChartProps {
  data: Array<{
    date: string;
    hours: number;
    minutes: number;
  }>;
}

export function FocusTimeChart({ data }: FocusTimeChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {format(new Date(payload[0].payload.date), "MMM d, yyyy")}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
            {payload[0].payload.hours}h ({payload[0].payload.minutes}m)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Focus Time Trend (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM d")}
            className="text-xs text-slate-600 dark:text-slate-400"
            stroke="currentColor"
          />
          <YAxis
            className="text-xs text-slate-600 dark:text-slate-400"
            stroke="currentColor"
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
