import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    // Example: get total focus time and session count today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalFocusSeconds = await prisma.focusSession.aggregate({
      _sum: { duration: true },
      where: { userId: user.id, startedAt: { gte: today } },
    });

    const sessionCount = await prisma.focusSession.count({
      where: { userId: user.id, startedAt: { gte: today } },
    });

    return NextResponse.json({
      totalFocusSeconds: totalFocusSeconds._sum.duration || 0,
      sessionCount,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
