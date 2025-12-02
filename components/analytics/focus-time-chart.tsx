"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
        <div className="bg-popover p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-popover-foreground">
            {format(new Date(payload[0].payload.date), "MMM d, yyyy")}
          </p>
          <p className="text-sm text-foreground font-semibold">
            {payload[0].payload.hours}h ({payload[0].payload.minutes}m)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Focus Time Trend (Last 30 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM d")}
            className="text-xs text-muted-foreground"
            stroke="currentColor"
          />
          <YAxis
            className="text-xs text-muted-foreground"
            stroke="currentColor"
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
