import { CheckSquare } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
              <CheckSquare className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Taskwise
            </h1>
          </Link>
          <p className="text-muted-foreground">
            Manage your tasks with clarity and focus
          </p>
        </div>

        <div className="glass rounded-2xl shadow-2xl shadow-black/5 overflow-hidden border border-white/20 dark:border-white/10">
          {children}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Taskwise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
