import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }, // Only select what we need
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get pagination parameters from query string
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.task.count({
      where: {
        userId: user.id,
        isDeleted: false,
      },
    });

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        deadline: true,
        completed: true,
        categoryId: true,
        estimatedDuration: true,
        actualDuration: true,
        order: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        focusSessions: {
          select: {
            duration: true,
          },
        },
        subtasks: {
          select: {
            id: true,
            title: true,
            completed: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
      skip,
      take: limit,
    });

    // Calculate total focus time for each task
    const tasksWithFocusTime = tasks.map((task) => ({
      ...task,
      totalFocusTime: task.focusSessions.reduce(
        (sum, session) => sum + session.duration,
        0
      ),
    }));

    return NextResponse.json({
      tasks: tasksWithFocusTime,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + tasks.length < totalCount,
      },
    });
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
    const {
      title,
      description,
      priority,
      deadline,
      estimatedDuration,
      categoryId,
    } = body;

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
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
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
