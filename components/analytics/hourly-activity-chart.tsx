"use client";

import React from "react";
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
        <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-popover-foreground">
            {payload[0].payload.label}
          </p>
          <p className="text-sm text-foreground font-semibold">
            {payload[0].payload.minutes} minutes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Most Productive Hours
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="label"
            className="text-xs text-muted-foreground"
            stroke="currentColor"
            interval={2}
          />
          <YAxis
            className="text-xs text-muted-foreground"
            stroke="currentColor"
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="minutes"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
