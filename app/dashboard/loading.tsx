import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-2 relative">
      {/* Background Gradients for Loading State */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-background">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>
      {/* Welcome Section Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[200px] rounded-full hidden md:block" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>

      {/* Focus Hours Skeleton */}
      <Skeleton className="h-[400px] w-full rounded-xl" />

      {/* Three Column Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
