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
  low: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  medium:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  high: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

export function TodaysTasks({ tasks }: TodaysTasksProps) {
  const displayTasks = tasks.slice(0, 5);

  return (
    <Card className="p-6 glass border-border/50 h-full flex flex-col bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 tracking-tight">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          Today's Tasks
        </h3>
        <Link href="/dashboard/tasks" className="cursor-pointer">
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
          >
            View All
          </Button>
        </Link>
      </div>

      {displayTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground flex-1 flex flex-col justify-center items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium">No tasks due today</p>
          <p className="text-xs text-muted-foreground/70">
            You're all caught up! 🎉
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/80 transition-all duration-200 group border border-transparent hover:border-border/50 cursor-default"
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate transition-colors ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground group-hover:text-primary"
                  }`}
                >
                  {task.title}
                </p>
                {task.deadline && (
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                  className={`text-[10px] px-2 py-0.5 h-5 uppercase tracking-wider ${
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
