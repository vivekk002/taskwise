import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }
  return (
    <div className="max-w-md mx-auto my-10 p-6 rounded-md border shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      <SignupForm />
    </div>
  );
}
