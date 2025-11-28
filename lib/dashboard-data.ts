import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return getEmptyStats();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return getEmptyStats();
  }

  // Fetch all tasks for the user
  const allTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      isDeleted: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate stats
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;
  const activeTasks = allTasks.filter((t) => !t.completed).length;

  // Get overdue tasks (deadline passed and not completed)
  const now = new Date();
  const overdueTasks = allTasks.filter(
    (t) => !t.completed && t.deadline && new Date(t.deadline) < now
  ).length;

  // Get today's tasks (deadline is today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = allTasks.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline) >= today &&
      new Date(t.deadline) < tomorrow
  ).length;

  const todayCompleted = allTasks.filter(
    (t) =>
      t.completed &&
      t.deadline &&
      new Date(t.deadline) >= today &&
      new Date(t.deadline) < tomorrow
  ).length;

  // Calculate yesterday's completed tasks for comparison
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayCompleted = allTasks.filter(
    (t) => t.completed && t.updatedAt >= yesterday && t.updatedAt < today
  ).length;

  // Calculate percentage change from yesterday
  const completedChange =
    yesterdayCompleted > 0
      ? Math.round(
          ((todayCompleted - yesterdayCompleted) / yesterdayCompleted) * 100
        )
      : todayCompleted > 0
      ? 100
      : 0;

  // Get focus time for today and this week
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const todaySessions = await prisma.focusSession.findMany({
    where: {
      userId: user.id,
      startedAt: { gte: todayStart },
    },
  });

  const weekSessions = await prisma.focusSession.findMany({
    where: {
      userId: user.id,
      startedAt: { gte: weekStart },
    },
  });

  const todayFocusTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const weekFocusTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = weekSessions.length;

  // Calculate completion rate
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get daily overview for the past 7 days
  const dailyOverview = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const completedOnDay = allTasks.filter(
      (t) => t.completed && t.updatedAt >= date && t.updatedAt < nextDate
    ).length;

    dailyOverview.push({
      date: days[date.getDay()],
      completed: completedOnDay,
    });
  }

  // Get today's tasks (with details)
  const todaysTasksList = allTasks
    .filter(
      (t) =>
        !t.completed &&
        t.deadline &&
        new Date(t.deadline) >= today &&
        new Date(t.deadline) < tomorrow
    )
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      completed: t.completed,
      dueTime: new Date(t.deadline!).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }));

  // Get upcoming deadlines (next 7 days, not today)
  const nextWeek = new Date(tomorrow);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingDeadlinesList = allTasks
    .filter(
      (t) =>
        !t.completed &&
        t.deadline &&
        new Date(t.deadline) >= tomorrow &&
        new Date(t.deadline) < nextWeek
    )
    .sort(
      (a, b) =>
        new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
    )
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      dueDate: new Date(t.deadline!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

  // Get recent focus sessions
  const recentSessionsList = await prisma.focusSession.findMany({
    where: {
      userId: user.id,
    },
    include: {
      task: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      startedAt: "desc",
    },
    take: 5,
  });

  const recentSessions = recentSessionsList.map((s) => ({
    id: s.id,
    task: {
      title: s.task.title,
    },
    duration: s.duration,
    startedAt: s.startedAt.toISOString(),
  }));

  return {
    stats: {
      totalTasks,
      completedTasks,
      activeTasks,
      overdueTasks,
      todayTasks,
      todayCompleted,
      todayFocusTime,
      weekFocusTime,
      totalSessions,
      completionRate,
      completedChange,
    },
    dailyOverview,
    todaysTasks: todaysTasksList,
    upcomingDeadlines: upcomingDeadlinesList,
    recentSessions,
  };
}

function getEmptyStats() {
  return {
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      activeTasks: 0,
      overdueTasks: 0,
      todayTasks: 0,
      todayCompleted: 0,
      todayFocusTime: 0,
      weekFocusTime: 0,
      totalSessions: 0,
      completionRate: 0,
      completedChange: 0,
    },
    dailyOverview: [
      { date: "Mon", completed: 0 },
      { date: "Tue", completed: 0 },
      { date: "Wed", completed: 0 },
      { date: "Thu", completed: 0 },
      { date: "Fri", completed: 0 },
      { date: "Sat", completed: 0 },
      { date: "Sun", completed: 0 },
    ],
    todaysTasks: [],
    upcomingDeadlines: [],
    recentSessions: [],
  };
}
