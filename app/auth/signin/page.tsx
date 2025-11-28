"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SigninForm } from "@/components/auth/signin-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const errorMessages: Record<string, string> = {
  EmailNotVerified: "Your email is not verified. Please check your inbox.",
  InvalidCredentials: "Invalid email or password.",
  CredentialsSignin: "Invalid email or password.",
  OAuthSignin: "Error signing in with OAuth provider.",
};

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return <SignInPageClient />;
}

function SignInPageClient() {
  const params = useSearchParams();
  const errorParam = params.get("error") ?? "";
  const verifiedParam = params.get("verified");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [emailValue, setEmailValue] = useState("");

  useEffect(() => {
    console.log("params", params);
    if (errorParam) {
      const matchedError = Object.keys(errorMessages).find(
        (key) => key.toLowerCase() === errorParam.toLowerCase()
      );
      if (matchedError) {
        setErrorMessage(errorMessages[matchedError]);
        setShowResend(matchedError === "EmailNotVerified");
      } else {
        setErrorMessage("An unknown error occurred.");
        setShowResend(false);
      }
    } else {
      setErrorMessage("");
      setShowResend(false);
    }

    if (verifiedParam === "true") {
      setSuccessMessage(
        "Your email was successfully verified. Please sign in."
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [errorParam, verifiedParam]);

  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmailValue(e.target.value);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-semibold text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold text-center">
            {successMessage}
          </div>
        )}
        <SigninForm
          emailValue={emailValue}
          onEmailChange={onEmailChange}
          showResend={showResend}
        />
      </div>
    </div>
  );
}
