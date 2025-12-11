import useSWR from "swr";
import { fetcher } from "@/lib/swr-config";

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export function useCategories() {
  const { data, error, mutate, isLoading } = useSWR<Category[]>(
    "/api/categories",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate,
  };
}
