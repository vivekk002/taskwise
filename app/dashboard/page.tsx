import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats } from "@/lib/dashboard-data";
import { getGreeting } from "@/lib/utils";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { FocusHours } from "@/components/dashboard/focus-hours";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickAddTask } from "@/components/dashboard/quick-add-task";

// Lazy load heavy components
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
    <div className="space-y-10 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent tracking-tight">
            {greeting}, {session?.user?.name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border/50 hidden md:block backdrop-blur-sm">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <QuickAddTask />
        </div>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={stats.stats} />

      {/* Focus Hours Component */}
      <FocusHours
        todayFocusTime={stats.stats.todayFocusTime}
        dailyFocusData={stats.dailyFocusData}
        weeklyFocusData={stats.weeklyFocusData}
        monthlyFocusData={stats.monthlyFocusData}
      />

      {/* Three Column Grid - Today's Tasks, Upcoming Deadlines, Recent Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TodaysTasks tasks={stats.todaysTasks} />
        <UpcomingDeadlines tasks={stats.upcomingDeadlines} />
        <RecentSessions sessions={stats.recentSessions} />
      </div>
    </div>
  );
}
