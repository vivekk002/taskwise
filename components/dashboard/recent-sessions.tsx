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
  const displaySessions = sessions.slice(0, 5);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="p-6 glass border-border/50 h-full flex flex-col bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 tracking-tight">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-emerald-500" />
          </div>
          Recent Sessions
        </h3>
        <Link href="/dashboard/sessions" className="cursor-pointer">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
          >
            View All
          </Button>
        </Link>
      </div>

      {displaySessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
            <Timer className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium">No sessions today</p>
          <p className="text-xs text-muted-foreground/70">
            Start focusing to track your progress! ⏱️
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {displaySessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/80 transition-all duration-200 group border border-transparent hover:border-border/50"
            >
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <Timer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {session.task.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(session.startedAt), "h:mm a")}
                </p>
              </div>
              <div className="text-right">
                <div className="px-2 py-1 bg-background rounded-md shadow-sm border border-border/50">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatDuration(session.duration)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
