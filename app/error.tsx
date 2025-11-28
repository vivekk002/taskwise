"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">
        Something went wrong!
      </h2>
      <p className="mb-6 text-muted-foreground max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = "/"} variant="outline">
          Go Home
        </Button>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
