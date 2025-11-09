import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 rounded-md border shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
      <SignInForm />
    </div>
  );
}
