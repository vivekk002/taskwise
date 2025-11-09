import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Welcome to TaskWise
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Your intelligent task management and productivity companion
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signin">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="px-8">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
