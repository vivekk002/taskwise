"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Tag,
  ListTodo,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { TaskCard } from "./task-card";
import { TaskCardSkeleton } from "@/components/ui/loading-skeletons";
import { TaskDialog } from "@/components/dialogs/task-dialog";
import { CategoryDialog } from "@/components/dialogs/category-dialog";
import { ManageCategoriesDialog } from "@/components/dialogs/manage-categories-dialog";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import type { TaskWithRelations } from "@/types";
import { TaskFilters, FilterState } from "./task-filters";

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

type SortOption =
  | "manual"
  | "newest"
  | "oldest"
  | "deadline"
  | "priority"
  | "title"
  | "focusTime";

export function TasksContainer() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // New Filter State
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    categories: [],
  });

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
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

  // Sync filters with URL search params
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      if (filterParam === "completed") {
        setFilters((prev) => ({ ...prev, status: ["completed"] }));
      } else if (filterParam === "active") {
        setFilters((prev) => ({ ...prev, status: ["active"] }));
      } else if (filterParam === "overdue") {
        setFilters((prev) => ({ ...prev, status: ["overdue"] }));
      }
    }
  }, [searchParams]);

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
        setTasks(data);
      } else {
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
    categoryId?: string;
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
          toast.success("Task created successfully!");
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
          toast.success("Task updated successfully!");
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
          toast.success("Task completed! 🎉");
        } else {
          toast.info("Task marked as incomplete");
        }
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        // Also update tasks that had this category to remove it
        setTasks((prev) =>
          prev.map((t) =>
            t.categoryId === categoryId
              ? { ...t, categoryId: null, category: null }
              : t
          )
        );
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      throw error;
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
        toast.success("Task deleted");
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

  const handleFilterChange = (key: keyof FilterState, value: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      status: [],
      priority: [],
      categories: [],
    });
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

    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

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
      fetchTasks();
    }
  };

  const isFiltered =
    searchQuery ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.categories.length > 0 ||
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

          // Priority Filter (Multi-select)
          const matchesPriority =
            filters.priority.length === 0 ||
            (task.priority &&
              filters.priority.includes(task.priority.toLowerCase()));

          // Status Filter (Multi-select)
          let matchesStatus = true;
          if (filters.status.length > 0) {
            const isCompleted = task.completed;
            const isOverdue =
              !task.completed &&
              task.deadline &&
              new Date(task.deadline) < new Date();
            const isActive = !task.completed && !isOverdue;

            matchesStatus = filters.status.some((status) => {
              if (status === "active") return isActive;
              if (status === "completed") return isCompleted;
              if (status === "overdue") return isOverdue;
              return false;
            });
          }

          // Category Filter (Multi-select)
          const matchesCategory =
            filters.categories.length === 0 ||
            (task.categoryId && filters.categories.includes(task.categoryId));

          return (
            matchesSearch && matchesPriority && matchesStatus && matchesCategory
          );
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Tasks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and organize your {filteredTasks.length} tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsManageCategoriesOpen(true)}
            className="hover:bg-secondary/80"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Manage
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCategoryDialogOpen(true)}
            className="hover:bg-secondary/80"
          >
            <Tag className="mr-2 h-4 w-4" />
            Category
          </Button>
          <Button
            onClick={() => handleOpenDialog()}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block col-span-1 h-full">
          <div className="sticky top-6 space-y-4">
            <TaskFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              counts={counts}
              className="bg-card/50 border rounded-xl p-5 shadow-sm backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Task Grid (Main Content) */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {/* Mobile Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your task list</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <TaskFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      categories={categories}
                      counts={counts}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-all"
              />
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-border/50">
                <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
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

          {/* Active Filters Summary (Optional, if needed for clarity) */}
          {isFiltered && (
            <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md text-sm">
              <span className="text-muted-foreground">
                Showing {filteredTasks.length} results
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-0 text-primary hover:underline"
              >
                Clear all filters
              </Button>
            </div>
          )}

          {/* Tasks List */}
          {isLoading ? (
            <TaskCardSkeleton count={6} />
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tasks" direction="vertical">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                            description="Try adjusting your filters or search query."
                            actionLabel="Clear Filters"
                            onAction={handleClearFilters}
                          />
                        ) : (
                          <EmptyState
                            icon={ListTodo}
                            title="No tasks yet"
                            description="Create your first task to get started!"
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
        </div>
      </div>

      {/* Dialogs */}
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

      <CategoryDialog
        open={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSave={handleCreateCategory}
      />

      <ManageCategoriesDialog
        open={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        categories={categories}
        onDelete={handleDeleteCategory}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteConfirm.taskTitle}"?`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
