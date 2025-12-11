import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getNextLevelThreshold } from "@/lib/gamification";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { xp: true, level: true, currentStreak: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const nextLevelThreshold = getNextLevelThreshold(user.level);

    return NextResponse.json({
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      nextLevelThreshold,
    });
  } catch (error) {
    console.error("Failed to fetch gamification data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
