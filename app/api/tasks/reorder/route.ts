import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    // Transactional update for all items
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.task.update({
          where: {
            id: item.id,
            userId: session.user.id, // Ensure user owns the task
          },
          data: {
            order: item.order,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TASKS_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
