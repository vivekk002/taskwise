import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Get all sessions for last 30 days
    const sessions = await prisma.focusSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            priority: true,
          },
        },
      },
      orderBy: {
        startedAt: "asc",
      },
    });

    // Get all tasks
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        focusSessions: true,
      },
    });

    // Calculate daily focus time for last 30 days
    const dailyFocusTime: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      dailyFocusTime[dateKey] = 0;
    }

    sessions.forEach((session) => {
      const dateKey = new Date(session.startedAt).toISOString().split("T")[0];
      if (dailyFocusTime[dateKey] !== undefined) {
        dailyFocusTime[dateKey] += session.duration;
      }
    });

    const dailyData = Object.entries(dailyFocusTime)
      .map(([date, duration]) => ({
        date,
        hours: Number((duration / 3600).toFixed(2)),
        minutes: Math.floor(duration / 60),
      }))
      .reverse();

    // Calculate hourly distribution
    const hourlyDistribution: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyDistribution[i] = 0;
    }

    sessions.forEach((session) => {
      const hour = new Date(session.startedAt).getHours();
      hourlyDistribution[hour] += session.duration;
    });

    const hourlyData = Object.entries(hourlyDistribution).map(
      ([hour, duration]) => ({
        hour: parseInt(hour),
        label: `${hour.padStart(2, "0")}:00`,
        minutes: Math.floor(duration / 60),
      })
    );

    // Top 5 tasks by focus time
    const taskFocusTime = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      totalTime: task.focusSessions.reduce((sum, s) => sum + s.duration, 0),
      sessionCount: task.focusSessions.length,
    }));

    const topTasks = taskFocusTime
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 5)
      .map((task) => ({
        ...task,
        hours: Number((task.totalTime / 3600).toFixed(2)),
        minutes: Math.floor(task.totalTime / 60),
      }));

    // Weekly comparison
    const thisWeekSessions = sessions.filter(
      (s) => new Date(s.startedAt) >= sevenDaysAgo
    );
    const lastWeekStart = new Date(sevenDaysAgo);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekSessions = sessions.filter(
      (s) =>
        new Date(s.startedAt) >= lastWeekStart &&
        new Date(s.startedAt) < sevenDaysAgo
    );

    const thisWeekTime = thisWeekSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );
    const lastWeekTime = lastWeekSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    // Task completion stats
    const completedTasks = tasks.filter((t) => t.completed).length;
    const activeTasks = tasks.filter((t) => !t.completed).length;
    const completionRate =
      tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Priority distribution
    const priorityStats = {
      high: tasks.filter((t) => t.priority?.toLowerCase() === "high").length,
      medium: tasks.filter((t) => t.priority?.toLowerCase() === "medium")
        .length,
      low: tasks.filter((t) => t.priority?.toLowerCase() === "low").length,
    };

    // Summary stats
    const stats = {
      totalFocusTime: sessions.reduce((sum, s) => sum + s.duration, 0),
      totalSessions: sessions.length,
      averageSessionDuration:
        sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
          : 0,
      thisWeekTime,
      lastWeekTime,
      weekChange:
        lastWeekTime > 0
          ? ((thisWeekTime - lastWeekTime) / lastWeekTime) * 100
          : 0,
      totalTasks: tasks.length,
      completedTasks,
      activeTasks,
      completionRate,
      priorityStats,
    };

    return NextResponse.json({
      stats,
      dailyData,
      hourlyData,
      topTasks,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
