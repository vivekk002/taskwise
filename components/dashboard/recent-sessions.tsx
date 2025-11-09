"use client";

import React from "react";
import { Clock, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface Session {
  id: string;
  duration: number;
  startedAt: string;
  task: {
    title: string;
  };
}

interface RecentSessionsProps {
  sessions: Session[];
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Focus Sessions
        </h3>
        <Link href="/dashboard/sessions">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No sessions today</p>
          <p className="text-xs mt-1">Start focusing to track your progress! ⏱️</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Timer className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session.task.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {format(new Date(session.startedAt), "h:mm a")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatDuration(session.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
