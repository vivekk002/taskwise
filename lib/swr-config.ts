<<<<<<< HEAD
import { SWRConfiguration } from "swr";

// Default fetcher function
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object
    throw error;
  }

  return res.json();
};

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false, // Don't revalidate when window gets focus
  revalidateOnReconnect: true, // Revalidate when reconnecting
  dedupingInterval: 60000, // Dedupe requests within 60 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 5000, // Wait 5 seconds between retries
  shouldRetryOnError: true,
  // Keep data fresh for 5 minutes
  refreshInterval: 0, // Don't auto-refresh (only on demand)
};
=======
import { SWRConfiguration } from "swr";

// Default fetcher function
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object
    throw error;
  }

  return res.json();
};

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false, // Don't revalidate when window gets focus
  revalidateOnReconnect: true, // Revalidate when reconnecting
  dedupingInterval: 60000, // Dedupe requests within 60 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 5000, // Wait 5 seconds between retries
  shouldRetryOnError: true,
  // Keep data fresh for 5 minutes
  refreshInterval: 0, // Don't auto-refresh (only on demand)
};
>>>>>>> origin/main
