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

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get this week's date range
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // Get all tasks
    const allTasks = await prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      include: {
        focusSessions: true,
      },
    });

    // Today's tasks
    const todaysTasks = allTasks.filter((task) => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);
      return deadline >= today && deadline < tomorrow;
    });

    // Upcoming tasks (next 7 days)
    const upcomingTasks = allTasks
      .filter((task) => {
        if (!task.deadline || task.completed) return false;
        const deadline = new Date(task.deadline);
        return deadline >= today && deadline < weekEnd;
      })
      .sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
        return dateA - dateB;
      })
      .slice(0, 5);

    // Overdue tasks
    const overdueTasks = allTasks.filter((task) => {
      if (!task.deadline || task.completed) return false;
      return new Date(task.deadline) < today;
    });

    // Today's focus sessions
    const todaysSessions = await prisma.focusSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: today,
          lt: tomorrow,
        },
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

    // Calculate today's total focus time
    const todayFocusTime = todaysSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    // Calculate this week's total focus time
    const weekSessions = await prisma.focusSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: weekStart,
        },
      },
    });

    const weekFocusTime = weekSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    // Stats
    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter((t) => t.completed).length,
      activeTasks: allTasks.filter((t) => !t.completed).length,
      overdueTasks: overdueTasks.length,
      todayTasks: todaysTasks.length,
      todayCompleted: todaysTasks.filter((t) => t.completed).length,
      todayFocusTime,
      weekFocusTime,
      totalSessions: todaysSessions.length,
      completionRate:
        allTasks.length > 0
          ? Math.round(
              (allTasks.filter((t) => t.completed).length / allTasks.length) *
                100
            )
          : 0,
    };

    return NextResponse.json({
      stats,
      todaysTasks: todaysTasks.slice(0, 5),
      upcomingTasks,
      recentSessions: todaysSessions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
