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
      <div className="flex min-h-screen bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>

        {/* Fixed Sidebar */}
        <div className="hidden md:block fixed left-0 top-0 z-50 h-full">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300 relative z-10">
          <Header user={session.user} />
          <main className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TimerProvider>
  );
}
