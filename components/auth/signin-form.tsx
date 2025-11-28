"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  CheckCircle2,
  Github,
  Mail,
  Twitter,
  Loader2,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";

interface SigninFormProps {
  emailValue: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showResend?: boolean;
}

export function SigninForm({
  emailValue,
  onEmailChange,
  showResend = false,
}: SigninFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValue || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: emailValue,
        password,
      });

      if (result?.error) {
        if (result.error === "EmailNotVerified") {
          router.push("/auth/signin?error=EmailNotVerified");
        } else {
          toast.error(result.error);
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      toast.error(`Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  async function resendVerificationEmail() {
    setResendStatus("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendStatus(`Error: ${data.error || "Failed to send email"}`);
      } else {
        setResendStatus("Verification email sent! Please check your inbox.");
      }
    } catch {
      setResendStatus("Network error. Please try again later.");
    }
  }

  return (
    <Card className="w-full max-w-md p-6 glass border-0 shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 mb-4 shadow-lg shadow-primary/30 animate-pulse-subtle">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Taskwise
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => handleOAuthSignIn("google")}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Mail className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => handleOAuthSignIn("github")}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "github" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Github className="w-5 h-5" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all cursor-pointer"
          onClick={() => handleOAuthSignIn("twitter")}
          disabled={oauthLoading !== null}
        >
          {oauthLoading === "twitter" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Twitter className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={emailValue}
            onChange={onEmailChange}
            disabled={isLoading}
            required
            className="h-10 transition-all rounded-xl"
          />
        </div>

        <div className="space-y-1">
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="h-10 transition-all rounded-xl"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:-translate-y-0.5 mt-4 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {showResend && (
        <div className="mt-4">
          <Button
            onClick={resendVerificationEmail}
            className="w-full cursor-pointer"
            variant="outline"
          >
            Resend Verification Email
          </Button>
          {resendStatus && (
            <p className="mt-2 text-sm text-center">{resendStatus}</p>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          Forgot password?
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
