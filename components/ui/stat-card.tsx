import { memo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Memoized stat card component to prevent unnecessary re-renders
 * Only re-renders when props actually change
 */
export const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("glass p-6 border-white/5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>

          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.value > 0 ? (
                <TrendingUp
                  className={cn(
                    "w-4 h-4",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                />
              ) : trend.value < 0 ? (
                <TrendingDown
                  className={cn(
                    "w-4 h-4",
                    trend.isPositive ? "text-red-500" : "text-green-500"
                  )}
                />
              ) : (
                <Minus className="w-4 h-4 text-slate-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.value > 0 && trend.isPositive && "text-green-500",
                  trend.value > 0 && !trend.isPositive && "text-red-500",
                  trend.value < 0 && trend.isPositive && "text-red-500",
                  trend.value < 0 && !trend.isPositive && "text-green-500",
                  trend.value === 0 && "text-slate-500"
                )}
              >
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
});
