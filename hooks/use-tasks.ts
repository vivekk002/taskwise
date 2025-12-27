import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  deadline?: string;
  completed: boolean;
  categoryId?: string;
  estimatedDuration?: number;
  totalFocusTime?: number;
  subtasks?: any[];
  focusSessions?: any[];
}

export function useTasks() {
  const { data, error, mutate, isLoading } = useSWR<Task[]>(
    "/api/tasks",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    tasks: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTask(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Task>(
    id ? `/api/tasks/${id}` : null,
    fetcher
  );

  return {
    task: data,
    isLoading,
    isError: error,
    mutate,
  };
}
