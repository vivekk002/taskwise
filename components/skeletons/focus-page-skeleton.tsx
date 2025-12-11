import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function FocusPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Timer Display Skeleton */}
      <Card className="p-8 border-2">
        <div className="text-center space-y-6">
          {/* Status */}
          <div className="flex justify-center">
            <Skeleton className="h-8 w-40" />
          </div>

          {/* Timer */}
          <div className="flex justify-center">
            <Skeleton className="h-32 w-80" />
          </div>

          {/* Task Selection */}
          <div className="max-w-md mx-auto space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </Card>

      {/* Active Tasks List Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-5 h-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
