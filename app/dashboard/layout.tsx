import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";
import { TimerProvider } from "@/contexts/timer-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <TimerProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main Content Area with margin-left for sidebar */}
        <div className="flex-1 flex flex-col ml-64">
          <Header user={session.user} />
          <main className="p-6 flex-grow overflow-auto">{children}</main>
        </div>
      </div>
    </TimerProvider>
  );
}
