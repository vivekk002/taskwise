<<<<<<< HEAD
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData: any = { name };

    if (newPassword && currentPassword) {
      const isPasswordValid = await compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return new NextResponse("Invalid current password", { status: 400 });
      }

      const hashedPassword = await hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("[USER_SETTINGS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
=======
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData: any = { name };

    if (newPassword && currentPassword) {
      const isPasswordValid = await compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return new NextResponse("Invalid current password", { status: 400 });
      }

      const hashedPassword = await hash(newPassword, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("[USER_SETTINGS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
>>>>>>> origin/main
