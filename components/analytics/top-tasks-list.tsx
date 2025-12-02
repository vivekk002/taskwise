"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer } from "lucide-react";

interface TopTask {
  id: string;
  title: string;
  priority: string | null;
  hours: number;
  minutes: number;
  sessionCount: number;
}

interface TopTasksListProps {
  tasks: TopTask[];
}

const priorityColors: Record<string, string> = {
  low: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
  medium:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  high: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
};

export function TopTasksList({ tasks }: TopTasksListProps) {
  return (
    <Card className="p-6 glass border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        Top 5 Tasks by Focus Time
      </h3>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No focus sessions yet</p>
          <p className="text-xs mt-1">
            Start working on tasks to see your top performers!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {task.hours}h {task.minutes % 60}m
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {task.sessionCount} sessions
                  </span>
                </div>
              </div>
              {task.priority && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    priorityColors[task.priority.toLowerCase()]
                  }`}
                >
                  {task.priority}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
