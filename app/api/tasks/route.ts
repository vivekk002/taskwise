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

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        focusSessions: true,
        subtasks: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Calculate total focus time for each task
    const tasksWithFocusTime = tasks.map((task) => ({
      ...task,
      totalFocusTime: task.focusSessions.reduce(
        (sum, session) => sum + session.duration,
        0
      ),
    }));

    return NextResponse.json(tasksWithFocusTime);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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
    const { title, description, priority, deadline, estimatedDuration } = body;

    // Get the highest order number to add new task at the end
    const lastTask = await prisma.task.findFirst({
      where: { userId: session.user.id, isDeleted: false },
      orderBy: { order: "desc" },
    });

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority || "medium",
        deadline: deadline ? new Date(deadline) : null,
        userId: session.user.id,
        completed: false,
        isDeleted: false,
        estimatedDuration: estimatedDuration || null,
        order: lastTask ? lastTask.order + 1 : 0,
      },
      include: {
        focusSessions: true,
        subtasks: true,
      },
    });

    return NextResponse.json({ ...task, totalFocusTime: 0 }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
