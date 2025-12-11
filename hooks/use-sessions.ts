import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

export interface Session {
  id: string;
  userId: string;
  taskId: string;
  duration: number;
  startedAt: string;
  endedAt: string;
  notes?: string;
  completed: boolean;
  task?: {
    title: string;
    priority?: string;
  };
}

export function useSessions() {
  const { data, error, mutate, isLoading } = useSWR<Session[]>(
    "/api/sessions",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    sessions: data,
    isLoading,
    isError: error,
    mutate,
  };
}
