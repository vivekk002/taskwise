import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardContainer } from "@/components/dashboard/dashboard-container";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!session.user.id) {
    throw new Error("User id not found in session");
  }

  return <DashboardContainer userId={session.user.id} />;
}
