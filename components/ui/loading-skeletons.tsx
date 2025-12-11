import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Reusable loading skeleton for lists
 */
export function ListSkeleton({ count = 3, className }: LoadingSkeletonProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg mb-4" />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for task cards
 */
export function TaskCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-lg p-4 border border-white/5">
          <div className="flex items-start space-x-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2 mt-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Loading skeleton for stats cards
 */
export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for chart
 */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={`h-[400px] w-full rounded-lg ${className || ""}`} />
  );
}

/**
 * Wrapper component with Suspense boundary
 */
interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense
      fallback={fallback || <Skeleton className="h-32 w-full rounded-lg" />}
    >
      {children}
    </Suspense>
  );
}
