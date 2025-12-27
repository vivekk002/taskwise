import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId } = await params;

    // Verify ownership
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || category.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId } = await params;
    const { name, color } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.userId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name, color },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Failed to update category:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
