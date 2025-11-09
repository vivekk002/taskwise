import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Added import for cn

import type { TaskWithRelations } from "@/types";

interface TaskCardProps {
  task: TaskWithRelations;
  onEdit: (task: TaskWithRelations) => void;
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  isLoading?: boolean;
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-900",
  medium:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-900",
  high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-900",
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
  isLoading = false,
}: TaskCardProps) {
  const isOverdue =
    task.deadline && new Date(task.deadline) < new Date() && !task.completed;
  return (
    <Card className="relative group transition-colors">
      <div className="flex items-center space-x-4">
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
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-slate-400" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold truncate ${
              task.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground truncate">
              {task.description}
            </p>
          )}
          <div className="flex space-x-2 mt-1 items-center flex-wrap">
            {task.deadline && (
              <Badge
                className={cn(
                  isOverdue
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                ) : (
                  <Calendar className="h-4 w-4 inline mr-1" />
                )}
                <span>{`Due ${formatDistanceToNow(new Date(task.deadline), {
                  addSuffix: true,
                })}`}</span>
              </Badge>
            )}
            {task.priority && (
              <Badge className={priorityColors[task.priority.toLowerCase()]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            )}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
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
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
