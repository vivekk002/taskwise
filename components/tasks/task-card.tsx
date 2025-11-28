"use client";

import React, { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Timer,
  Pause,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTimer } from "@/contexts/timer-context";

import type { TaskWithRelations } from "@/types";

interface TaskCardProps {
  task: TaskWithRelations;
  onEdit: (task: TaskWithRelations) => void;
  onDelete: () => void;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-900",
  medium:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-900",
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-900",
};

/**
 * Memoized TaskCard component - only re-renders when props actually change
 * This prevents unnecessary re-renders when the parent component updates
 */
export const TaskCard = memo(function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  onRefresh,
  isLoading = false,
}: TaskCardProps) {
  const router = useRouter();
  const { isTimerActive, isTimerRunning, getElapsedSeconds } = useTimer();
  const [liveElapsed, setLiveElapsed] = useState(0);

  const hasActiveTimer = isTimerActive(task.id);
  const timerRunning = isTimerRunning(task.id);
  const isPaused = hasActiveTimer && !timerRunning;

  const isOverdue =
    task.deadline && new Date(task.deadline) < new Date() && !task.completed;

  // Update live elapsed time every second for active timers
  useEffect(() => {
    if (hasActiveTimer) {
      const interval = setInterval(() => {
        setLiveElapsed(getElapsedSeconds(task.id));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasActiveTimer, task.id, getElapsedSeconds]);

  const handleFocusClick = () => {
    // Navigate to focus page with task ID
    router.push(`/dashboard/focus?taskId=${task.id}`);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="relative group transition-all hover:shadow-md p-4 glass border-border/50">
      <div className="space-y-3">
        {/* Header with checkbox and title */}
        <div className="flex items-start space-x-3">
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={() => onToggle(task.id, !task.completed)}
            aria-label={
              task.completed
                ? `Mark ${task.title} as incomplete`
                : `Mark ${task.title} as complete`
            }
            className="shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-lg font-semibold truncate",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Edit and Delete buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit task ${task.title}`}
              onClick={() => onEdit(task)}
              disabled={isLoading}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete task ${task.title}`}
              onClick={onDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {task.deadline && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                isOverdue
                  ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              {isOverdue ? (
                <AlertCircle className="h-3 w-3 inline mr-1" />
              ) : (
                <Calendar className="h-3 w-3 inline mr-1" />
              )}
              <span>
                {`Due ${formatDistanceToNow(new Date(task.deadline), {
                  addSuffix: true,
                })}`}
              </span>
            </Badge>
          )}
          {task.priority && (
            <Badge
              variant="outline"
              className={priorityColors[task.priority.toLowerCase()]}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
          {task.category && (
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                task.category.color === "blue" &&
                  "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300",
                task.category.color === "red" &&
                  "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300",
                task.category.color === "green" &&
                  "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300",
                task.category.color === "yellow" &&
                  "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300",
                task.category.color === "purple" &&
                  "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300",
                task.category.color === "gray" &&
                  "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-300"
              )}
            >
              {task.category.name}
            </Badge>
          )}
        </div>

        {/* Subtask Progress */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <ListChecks className="w-3 h-3" />
            <span>
              {task.subtasks.filter((s) => s.completed).length}/
              {task.subtasks.length} subtasks
            </span>
          </div>
        )}

        {/* Focus Timer Section */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* Total Focus Time Display */}
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-medium text-slate-900 dark:text-slate-50">
                {task.totalFocusTime !== undefined && task.totalFocusTime > 0
                  ? formatTime(task.totalFocusTime)
                  : "00:00:00"}
              </span>
            </div>

            {/* Focus Timer Button */}
            <Button
              size="sm"
              variant={hasActiveTimer ? "secondary" : "default"}
              onClick={handleFocusClick}
              disabled={task.completed}
              className={cn("gap-1", timerRunning && "animate-pulse")}
            >
              {isPaused ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Timer className="w-3 h-3" />
              )}
              {timerRunning
                ? "View Timer"
                : isPaused
                ? "Continue"
                : "Start Focus"}
            </Button>
          </div>

          {/* Live Timer Display for Active Timer */}
          {hasActiveTimer && (
            <div
              className={cn(
                "px-3 py-2 rounded text-center",
                timerRunning
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium">
                  {timerRunning ? "Timer Running:" : "Timer Paused:"}
                </span>
                <span className="text-sm font-bold font-mono">
                  {formatTime(liveElapsed)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
