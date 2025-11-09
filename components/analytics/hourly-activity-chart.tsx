"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HourlyActivityChartProps {
  data: Array<{
    hour: number;
    label: string;
    minutes: number;
  }>;
}

export function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {payload[0].payload.label}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
            {payload[0].payload.minutes} minutes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Most Productive Hours
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
          <XAxis
            dataKey="label"
            className="text-xs text-slate-600 dark:text-slate-400"
            stroke="currentColor"
            interval={2}
          />
          <YAxis
            className="text-xs text-slate-600 dark:text-slate-400"
            stroke="currentColor"
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
