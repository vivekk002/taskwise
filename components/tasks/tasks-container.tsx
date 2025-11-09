"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { TaskCard } from "./task-card";
import { TaskDialog } from "@/components/dialogs/task-dialog"; // Named import as per your export
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskWithRelations } from "@/types";

function capitalizePriority(
  priority: string | undefined
): "Low" | "Medium" | "High" {
  if (!priority) return "Medium";
  const p = priority.toLowerCase();
  if (p === "low") return "Low";
  if (p === "high") return "High";
  return "Medium";
}

function lowercasePriority(
  priority: "Low" | "Medium" | "High" | undefined
): "low" | "medium" | "high" {
  if (!priority) return "medium";
  return priority.toLowerCase() as "low" | "medium" | "high";
}

export function TasksContainer() {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] =
    useState<Partial<TaskWithRelations> | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleOpenDialog = (task?: TaskWithRelations) => {
    if (task) {
      setEditingTask({
        ...task,
        priority: capitalizePriority(task.priority),
      });
    } else {
      setEditingTask(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleCreateOrUpdate = async (data: {
    title: string;
    priority: "Low" | "Medium" | "High";
    description?: string;
    deadline?: Date;
  }) => {
    try {
      const requestData = {
        ...data,
        priority: lowercasePriority(data.priority),
      };

      if (!editingTask) {
        // Create new task
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (res.ok) {
          const newTask = await res.json();
          setTasks([...tasks, newTask]);
          handleCloseDialog();
        }
      } else {
        // Update existing task
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (res.ok) {
          const updatedTask = await res.json();
          setTasks(
            tasks.map((t) => (t.id === editingTask.id ? updatedTask : t))
          );
          handleCloseDialog();
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleToggle = async (taskId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => handleOpenDialog(task)}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {isDialogOpen && (
        <TaskDialog
          open={isDialogOpen}
          task={
            editingTask
              ? {
                  ...editingTask,
                  description: editingTask.description ?? undefined,
                  deadline: editingTask.deadline ?? undefined,
                  priority: capitalizePriority(editingTask.priority),
                }
              : undefined
          }
          onClose={handleCloseDialog}
          onSave={handleCreateOrUpdate}
        />
      )}
    </div>
  );
}
