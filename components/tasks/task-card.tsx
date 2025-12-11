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
  low: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50",
  medium:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50",
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
    <Card className="relative group p-5 glass-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] border-border/50">
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
              <CheckCircle2 className="w-6 h-6 text-foreground" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
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
                  ? "bg-secondary text-foreground border-border"
                  : "bg-secondary text-muted-foreground border-border"
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
              variant="secondary"
              className={cn(
                "text-xs",
                priorityColors[task.priority.toLowerCase()]
              )}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
          {task.category && (
            <Badge variant="secondary" className="text-xs">
              {task.category.name}
            </Badge>
          )}
        </div>

        {/* Subtask Progress */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-medium text-foreground">
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
                  ? "bg-secondary text-foreground"
                  : "bg-muted text-muted-foreground"
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
