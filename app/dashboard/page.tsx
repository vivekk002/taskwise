import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard-data";
import { getGreeting } from "@/lib/utils";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActiveTimerWidget } from "@/components/dashboard/active-timer-widget";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const DailyOverviewChart = dynamic(
  () =>
    import("@/components/dashboard/daily-overview-chart").then((mod) => ({
      default: mod.DailyOverviewChart,
    })),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  }
);

const RecentSessions = dynamic(
  () =>
    import("@/components/dashboard/recent-sessions").then((mod) => ({
      default: mod.RecentSessions,
    })),
  {
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
  }
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const stats = await getDashboardStats();
  const greeting = getGreeting();

  return (
    <div className="space-y-8 p-2">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {greeting}, {session?.user?.name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={stats.stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section - Spans 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          <DailyOverviewChart data={stats.dailyOverview} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TodaysTasks tasks={stats.todaysTasks} />
            <UpcomingDeadlines tasks={stats.upcomingDeadlines} />
          </div>
        </div>

        {/* Right Sidebar - Spans 1 column */}
        <div className="space-y-8">
          <ActiveTimerWidget />
          <RecentSessions sessions={stats.recentSessions} />
        </div>
      </div>
    </div>
  );
}
