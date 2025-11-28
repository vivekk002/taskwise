import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <SignupForm />
    </div>
  );
}
