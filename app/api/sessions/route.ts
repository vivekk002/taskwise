import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP, updateStreak } from "@/lib/gamification";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count
    const totalCount = await prisma.focusSession.count({
      where: {
        userId: user.id,
      },
    });

    const sessions = await prisma.focusSession.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        duration: true,
        startedAt: true,
        endedAt: true,
        notes: true,
        completed: true,
        task: {
          select: {
            id: true,
            title: true,
            priority: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + sessions.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, duration, startedAt, endedAt, notes, completed } = body;

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Use the correct Prisma schema fields
    const focusSession = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        taskId: taskId,
        duration: duration,
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
        notes: notes || null,
        completed: completed ?? true,
      },
    });

    // Gamification: Award XP for focus time (e.g., 10 XP per minute)
    if (duration > 60) {
      const minutes = Math.floor(duration / 60);
      const xpEarned = minutes * 10;
      await awardXP(session.user.id, xpEarned);
      await updateStreak(session.user.id);
    }

    return NextResponse.json(focusSession, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
