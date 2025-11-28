"use client";

import React from "react";
import { CheckCircle2, Circle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: string | null;
  deadline?: string | null;
}

interface TodaysTasksProps {
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  medium:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

export function TodaysTasks({ tasks }: TodaysTasksProps) {
  return (
    <Card className="p-6 glass border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Today's Tasks
        </h3>
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No tasks due today</p>
          <p className="text-xs mt-1">You're all caught up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </p>
                {task.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Due{" "}
                    {formatDistanceToNow(new Date(task.deadline), {
                      addSuffix: true,
                    })}
                  </p>
                )}
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
