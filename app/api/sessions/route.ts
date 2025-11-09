import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const json = await req.json();
  const { taskId, duration, startedAt, endedAt, notes, completed } = json;

  try {
    const focusSession = await prisma.focusSession.create({
      data: {
        userId: user.id,
        taskId,
        duration,
        startedAt: new Date(startedAt),
        endedAt: new Date(endedAt),
        notes,
        completed,
      },
    });
    return NextResponse.json(focusSession);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save focus session" },
      { status: 500 }
    );
  }
}
