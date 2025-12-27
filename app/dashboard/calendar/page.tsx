"use client";

import React, { Suspense } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
  return (
    <div className="h-full flex flex-col space-y-6 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          View your tasks and deadlines in a monthly calendar.
        </p>
      </div>
      <div className="flex-1 min-h-0 border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <CalendarView />
        </Suspense>
      </div>
    </div>
  );
}
