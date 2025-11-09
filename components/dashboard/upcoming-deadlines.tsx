"use client";

import React from "react";
import { AlertCircle, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  priority?: string | null;
  deadline?: string | null;
}

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Upcoming Deadlines
        </h3>
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">No upcoming deadlines</p>
          <p className="text-xs mt-1">Stay organized! 📅</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {task.title}
                </p>
                {task.deadline && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(task.deadline), "MMM d, yyyy")}
                    </p>
                    <span className="text-xs text-slate-400">•</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
              {task.priority && (
                <Badge
                  variant="secondary"
                  className={`text-xs ${priorityColors[task.priority.toLowerCase()]}`}
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
