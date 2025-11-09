"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}

interface SubtasksListProps {
  taskId: string;
  subtasks: Subtask[];
  onUpdate: () => void;
}

export function SubtasksList({
  taskId,
  subtasks,
  onUpdate,
}: SubtasksListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) {
      toast.error("Subtask title cannot be empty");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSubtaskTitle }),
      });

      if (res.ok) {
        setNewSubtaskTitle("");
        onUpdate();
        toast.success("Subtask added");
      } else {
        toast.error("Failed to add subtask");
      }
    } catch (error) {
      console.error("Failed to add subtask:", error);
      toast.error("Failed to add subtask");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleSubtask = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/subtasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        onUpdate();
        toast.success(!completed ? "Subtask completed ✓" : "Subtask reopened");
      } else {
        toast.error("Failed to update subtask");
      }
    } catch (error) {
      console.error("Failed to toggle subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (id: string, title: string) => {
    if (!confirm(`Delete subtask "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/subtasks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onUpdate();
        toast.success("Subtask deleted");
      } else {
        toast.error("Failed to delete subtask");
      }
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Subtasks Progress</span>
            <span className="font-medium">
              {completedCount}/{totalCount} completed (
              {progressPercent.toFixed(0)}%)
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtasks List */}
      {subtasks.length > 0 && (
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() =>
                  handleToggleSubtask(subtask.id, subtask.completed)
                }
              >
                {subtask.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </Button>
              <span
                className={cn(
                  "text-sm flex-1",
                  subtask.completed
                    ? "line-through text-slate-500"
                    : "text-slate-900 dark:text-white"
                )}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteSubtask(subtask.id, subtask.title)}
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Subtask */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a subtask..."
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isAdding) {
              handleAddSubtask();
            }
          }}
          disabled={isAdding}
          className="text-sm"
        />
        <Button
          size="sm"
          onClick={handleAddSubtask}
          disabled={isAdding || !newSubtaskTitle.trim()}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Adding..." : "Add"}
        </Button>
      </div>

      {subtasks.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
          No subtasks yet. Add one to break down this task!
        </p>
      )}
    </div>
  );
}
