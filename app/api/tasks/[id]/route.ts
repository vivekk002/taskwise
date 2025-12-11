import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP, updateStreak } from "@/lib/gamification";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        focusSessions: true,
        subtasks: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const totalFocusTime = task.focusSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    return NextResponse.json({ ...task, totalFocusTime });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      priority,
      deadline,
      completed,
      estimatedDuration,
      actualDuration,
      order,
      categoryId,
    } = body;

    // Verify task ownership
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id: id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(deadline !== undefined && {
          deadline: deadline ? new Date(deadline) : null,
        }),
        ...(completed !== undefined && { completed }),
        ...(estimatedDuration !== undefined && { estimatedDuration }),
        ...(actualDuration !== undefined && { actualDuration }),
        ...(order !== undefined && { order }),
        ...(categoryId !== undefined && {
          categoryId: categoryId === "none" ? null : categoryId,
        }),
      },
      include: {
        focusSessions: true,
        subtasks: true,
      },
    });

    const totalFocusTime = task.focusSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    // Gamification: Award XP if task is completed
    if (completed === true && !existingTask.completed) {
      await awardXP(session.user.id, 50); // 50 XP for completing a task
      await updateStreak(session.user.id);
    }

    return NextResponse.json({ ...task, totalFocusTime });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify task ownership
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.task.update({
      where: { id: id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
