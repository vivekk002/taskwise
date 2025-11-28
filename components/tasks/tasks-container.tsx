"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  ArrowUpDown,
  GripVertical,
  Tag,
  ListTodo,
} from "lucide-react";
import { toast } from "sonner";
import { TaskCard } from "./task-card";
import { TaskCardSkeleton } from "@/components/ui/loading-skeletons";
import { TaskDialog } from "@/components/dialogs/task-dialog";
import { CategoryDialog } from "@/components/dialogs/category-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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

type PriorityFilter = "all" | "low" | "medium" | "high";
type StatusFilter = "all" | "active" | "completed" | "overdue";
type SortOption =
  | "manual"
  | "newest"
  | "oldest"
  | "deadline"
  | "priority"
  | "title"
  | "focusTime";

export function TasksContainer() {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingTask, setEditingTask] =
    useState<Partial<TaskWithRelations> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    open: false,
    taskId: null,
    taskTitle: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/tasks");

      if (!res.ok) {
        toast.error("Failed to load tasks");
        setTasks([]);
        return;
      }

      const data = await res.json();

      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      } else if (Array.isArray(data)) {
        // Fallback for backward compatibility
        setTasks(data);
      } else {
        console.error("Invalid tasks data structure:", data);
        toast.error("Invalid tasks data");
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateCategory = async (data: {
    name: string;
    color: string;
  }) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newCategory = await res.json();
        setCategories((prev) => [newCategory, ...prev]);
        toast.success("Category created!");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category");
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
        deadline: data.deadline?.toISOString(),
      };

      if (!editingTask) {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (res.ok) {
          const newTask = await res.json();
          setTasks((prevTasks) => [newTask, ...prevTasks]);
          handleCloseDialog();
          toast.success("Task created successfully!", {
            description: newTask.title,
          });
        } else {
          toast.error("Failed to create task");
        }
      } else {
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        if (res.ok) {
          const updatedTask = await res.json();
          setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === editingTask.id ? updatedTask : t))
          );
          handleCloseDialog();
          toast.success("Task updated successfully!", {
            description: updatedTask.title,
          });
        } else {
          toast.error("Failed to update task");
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleToggle = async (taskId: string, completed: boolean) => {
    const task = tasks.find((t) => t.id === taskId);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
        );

        if (completed) {
          toast.success("Task completed! 🎉", {
            description: task?.title,
          });
        } else {
          toast.info("Task marked as incomplete", {
            description: task?.title,
          });
        }
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteClick = (taskId: string, taskTitle: string) => {
    setDeleteConfirm({ open: true, taskId, taskTitle });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId) return;

    try {
      const res = await fetch(`/api/tasks/${deleteConfirm.taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks((prevTasks) =>
          prevTasks.filter((t) => t.id !== deleteConfirm.taskId)
        );
        toast.success("Task deleted", {
          description: deleteConfirm.taskTitle,
        });
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    } finally {
      setDeleteConfirm({ open: false, taskId: null, taskTitle: "" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    toast.info("Filters cleared");
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const newTasks = Array.from(filteredTasks);
    const [reorderedItem] = newTasks.splice(sourceIndex, 1);
    newTasks.splice(destinationIndex, 0, reorderedItem);

    // Optimistic update
    // We need to update the main 'tasks' state, not just the filtered one
    // This is tricky with filters, so we only allow drag when filters are mostly empty or we handle it carefully
    // For now, we'll update the local state to reflect the visual change
    // But since 'filteredTasks' is derived, we need to update 'tasks'

    // Simplification: Only allow reordering when showing all tasks (no search/filter) or handle it by finding the item in main list
    // Better approach: Update the 'order' field of the affected tasks

    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    // Update local state immediately
    // We need to merge these updated tasks back into the main 'tasks' array
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    updatedTasks.forEach((t) => taskMap.set(t.id, t));
    setTasks(Array.from(taskMap.values()));

    try {
      const itemsToUpdate = updatedTasks.map((t) => ({
        id: t.id,
        order: t.order,
      }));

      await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToUpdate }),
      });
    } catch (error) {
      console.error("Failed to reorder tasks:", error);
      toast.error("Failed to save new order");
      fetchTasks(); // Revert on error
    }
  };

  const isFiltered =
    searchQuery ||
    priorityFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "newest";

  const sortTasks = (tasksToSort: TaskWithRelations[]): TaskWithRelations[] => {
    const sorted = [...tasksToSort];

    switch (sortBy) {
      case "manual":
        return sorted.sort((a, b) => (a.order || 0) - (b.order || 0));

      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "deadline":
        return sorted.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        });

      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sorted.sort((a, b) => {
          const aPriority =
            (a.priority?.toLowerCase() as keyof typeof priorityOrder) ||
            "medium";
          const bPriority =
            (b.priority?.toLowerCase() as keyof typeof priorityOrder) ||
            "medium";
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });

      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));

      case "focusTime":
        return sorted.sort((a, b) => {
          const aTime = a.totalFocusTime || 0;
          const bTime = b.totalFocusTime || 0;
          return bTime - aTime;
        });

      default:
        return sorted;
    }
  };

  const filteredTasks = Array.isArray(tasks)
    ? sortTasks(
        tasks.filter((task) => {
          const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesPriority =
            priorityFilter === "all" ||
            task.priority?.toLowerCase() === priorityFilter;

          let matchesStatus = true;
          if (statusFilter === "completed") {
            matchesStatus = task.completed;
          } else if (statusFilter === "active") {
            matchesStatus = !task.completed;
          } else if (statusFilter === "overdue") {
            const hasDeadline =
              task.deadline !== null && task.deadline !== undefined;
            const isOverdue = hasDeadline
              ? new Date(task.deadline!) < new Date()
              : false;
            matchesStatus = !task.completed && isOverdue;
          }

          return matchesSearch && matchesPriority && matchesStatus;
        })
      )
    : [];

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    overdue: tasks.filter((t) => {
      const hasDeadline = t.deadline !== null && t.deadline !== undefined;
      return !t.completed && hasDeadline && new Date(t.deadline!) < new Date();
    }).length,
    low: tasks.filter((t) => t.priority?.toLowerCase() === "low").length,
    medium: tasks.filter((t) => t.priority?.toLowerCase() === "medium").length,
    high: tasks.filter((t) => t.priority?.toLowerCase() === "high").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tasks
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCategoryDialogOpen(true)}
          >
            <Tag className="mr-2 h-4 w-4" />
            New Category
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Search and Sort Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
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

        {/* Sort Dropdown */}
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[200px]">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual Order</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="deadline">By Deadline</SelectItem>
            <SelectItem value="priority">By Priority</SelectItem>
            <SelectItem value="title">By Title (A-Z)</SelectItem>
            <SelectItem value="focusTime">By Focus Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filters
          </span>
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 text-xs gap-1"
            >
              <X className="w-3 h-3" />
              Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Status
            </label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks ({counts.all})</SelectItem>
                <SelectItem value="active">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Active ({counts.active})
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Completed ({counts.completed})
                  </span>
                </SelectItem>
                <SelectItem value="overdue">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Overdue ({counts.overdue})
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Priority
            </label>
            <Select
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as PriorityFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Priorities ({counts.all})
                </SelectItem>
                <SelectItem value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Low ({counts.low})
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Medium ({counts.medium})
                  </span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    High ({counts.high})
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {isFiltered && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery}"
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {priorityFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Priority:{" "}
                {priorityFilter.charAt(0).toUpperCase() +
                  priorityFilter.slice(1)}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setPriorityFilter("all")}
                />
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status:{" "}
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setStatusFilter("all")}
                />
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge variant="secondary" className="gap-1">
                <ArrowUpDown className="w-3 h-3" />
                Sort:{" "}
                {sortBy === "oldest"
                  ? "Oldest"
                  : sortBy === "deadline"
                  ? "Deadline"
                  : sortBy === "priority"
                  ? "Priority"
                  : sortBy === "title"
                  ? "Title"
                  : sortBy === "manual"
                  ? "Manual"
                  : "Focus Time"}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSortBy("newest")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <TaskCardSkeleton count={6} />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredTasks.length > 0 ? (
                  <>
                    {filteredTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                        isDragDisabled={sortBy !== "manual"}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={() => handleOpenDialog(task)}
                              onDelete={() =>
                                handleDeleteClick(task.id, task.title)
                              }
                              onToggle={handleToggle}
                              onRefresh={fetchTasks}
                              isLoading={false}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                ) : (
                  <div className="col-span-full">
                    {isFiltered ? (
                      <EmptyState
                        icon={Search}
                        title="No tasks found"
                        description="Try adjusting your filters or search query to find what you're looking for."
                        actionLabel="Clear Filters"
                        onAction={handleClearFilters}
                      />
                    ) : (
                      <EmptyState
                        icon={ListTodo}
                        title="No tasks yet"
                        description="Create your first task to get started on your productivity journey!"
                        actionLabel="Create Task"
                        onAction={() => handleOpenDialog()}
                      />
                    )}
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Task Dialog */}
      {isDialogOpen && (
        <TaskDialog
          open={isDialogOpen}
          task={
            editingTask
              ? {
                  id: editingTask.id,
                  title: editingTask.title,
                  description: editingTask.description ?? undefined,
                  deadline: editingTask.deadline
                    ? new Date(editingTask.deadline)
                    : undefined,
                  priority: capitalizePriority(editingTask.priority),
                  categoryId: editingTask.categoryId ?? undefined,
                }
              : undefined
          }
          onClose={handleCloseDialog}
          onSave={handleCreateOrUpdate}
        />
      )}

      {/* Category Dialog */}
      <CategoryDialog
        open={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSave={handleCreateCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
