import { toast } from "sonner";
import { Task } from "@/hooks/use-tasks";

interface OptimisticUpdateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Optimistically update task completion status
 */
export async function optimisticToggleTask(
  taskId: string,
  completed: boolean,
  mutate: any,
  options?: OptimisticUpdateOptions
) {
  // Optimistically update the UI
  mutate(
    (currentTasks: Task[] | undefined) => {
      if (!currentTasks) return currentTasks;
      return currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      );
    },
    false // Don't revalidate immediately
  );

  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!res.ok) throw new Error("Failed to update task");

    // Revalidate to sync with server
    mutate();
    options?.onSuccess?.();
  } catch (error) {
    // Rollback on error
    mutate();
    toast.error("Failed to update task");
    options?.onError?.(error as Error);
  }
}

/**
 * Optimistically create a new task
 */
export async function optimisticCreateTask(
  taskData: Partial<Task>,
  mutate: any,
  options?: OptimisticUpdateOptions
) {
  // Create temporary task with optimistic ID
  const tempTask: Task = {
    id: `temp-${Date.now()}`,
    title: taskData.title || "",
    description: taskData.description,
    priority: taskData.priority || "medium",
    deadline: taskData.deadline,
    completed: false,
    categoryId: taskData.categoryId,
    estimatedDuration: taskData.estimatedDuration,
    totalFocusTime: 0,
    subtasks: [],
    focusSessions: [],
  };

  // Optimistically add to UI
  mutate((currentTasks: Task[] | undefined) => {
    if (!currentTasks) return [tempTask];
    return [...currentTasks, tempTask];
  }, false);

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) throw new Error("Failed to create task");

    const newTask = await res.json();

    // Replace temp task with real task
    mutate((currentTasks: Task[] | undefined) => {
      if (!currentTasks) return [newTask];
      return currentTasks.map((task) =>
        task.id === tempTask.id ? newTask : task
      );
    }, false);

    toast.success("Task created successfully");
    options?.onSuccess?.();
  } catch (error) {
    // Remove temp task on error
    mutate((currentTasks: Task[] | undefined) => {
      if (!currentTasks) return currentTasks;
      return currentTasks.filter((task) => task.id !== tempTask.id);
    }, false);
    toast.error("Failed to create task");
    options?.onError?.(error as Error);
  }
}

/**
 * Optimistically delete a task
 */
export async function optimisticDeleteTask(
  taskId: string,
  mutate: any,
  options?: OptimisticUpdateOptions
) {
  // Store the task for potential rollback
  let deletedTask: Task | undefined;

  // Optimistically remove from UI
  mutate((currentTasks: Task[] | undefined) => {
    if (!currentTasks) return currentTasks;
    deletedTask = currentTasks.find((task) => task.id === taskId);
    return currentTasks.filter((task) => task.id !== taskId);
  }, false);

  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete task");

    toast.success("Task deleted successfully");
    options?.onSuccess?.();
  } catch (error) {
    // Rollback: add the task back
    if (deletedTask) {
      mutate((currentTasks: Task[] | undefined) => {
        if (!currentTasks) return [deletedTask!];
        return [...currentTasks, deletedTask!];
      }, false);
    }
    toast.error("Failed to delete task");
    options?.onError?.(error as Error);
  }
}

/**
 * Optimistically update task data
 */
export async function optimisticUpdateTask(
  taskId: string,
  updates: Partial<Task>,
  mutate: any,
  options?: OptimisticUpdateOptions
) {
  // Store original task for rollback
  let originalTask: Task | undefined;

  // Optimistically update UI
  mutate((currentTasks: Task[] | undefined) => {
    if (!currentTasks) return currentTasks;
    return currentTasks.map((task) => {
      if (task.id === taskId) {
        originalTask = task;
        return { ...task, ...updates };
      }
      return task;
    });
  }, false);

  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update task");

    const updatedTask = await res.json();

    // Update with server response
    mutate((currentTasks: Task[] | undefined) => {
      if (!currentTasks) return currentTasks;
      return currentTasks.map((task) =>
        task.id === taskId ? updatedTask : task
      );
    }, false);

    toast.success("Task updated successfully");
    options?.onSuccess?.();
  } catch (error) {
    // Rollback to original
    if (originalTask) {
      mutate((currentTasks: Task[] | undefined) => {
        if (!currentTasks) return currentTasks;
        return currentTasks.map((task) =>
          task.id === taskId ? originalTask! : task
        );
      }, false);
    }
    toast.error("Failed to update task");
    options?.onError?.(error as Error);
  }
}
