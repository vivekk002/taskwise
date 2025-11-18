"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SigninForm } from "@/components/auth/signin-form";

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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      {errorMessage && (
        <div className="mb-4 text-red-600 font-semibold">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="mb-4 text-green-600 font-semibold">
          {successMessage}
        </div>
      )}
      <SigninForm
        emailValue={emailValue}
        onEmailChange={onEmailChange}
        showResend={showResend}
      />
    </div>
  );
}
