import React from "react";
import { Card } from "@/components/ui/card";

interface TodayFocusData {
  today?: {
    hours?: number;
    minutes?: number;
  };
}

interface TodayFocusCardProps {
  data?: TodayFocusData;
}

export function TodayFocusCard({ data }: TodayFocusCardProps) {
  const hours = data?.today?.hours ?? 0;
  const minutes = data?.today?.minutes ?? 0;

  return (
    <Card className="p-6 glass border-border/50">
      <h2 className="text-lg font-semibold text-muted-foreground">
        Today's Focus Time
      </h2>
      <p className="text-5xl font-bold text-foreground">
        {hours}
        <span className="text-3xl ml-3">h</span> {minutes}
        <span className="text-3xl ml-1">m</span>
      </p>
    </Card>
  );
}
