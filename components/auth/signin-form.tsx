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

export function SigninForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // Show the specific error message from auth
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setOauthLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/50">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Sign in to continue to Taskwise
          </p>
        </div>

        <Card className="p-10 shadow-xl backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 gap-2 border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
              onClick={() => handleOAuthSignIn("google")}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "google" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mail className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-medium">Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 gap-2 border-2 hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              onClick={() => handleOAuthSignIn("github")}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "github" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              <span className="font-medium">Continue with GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 gap-2 border-2 hover:border-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 transition-all"
              onClick={() => handleOAuthSignIn("twitter")}
              disabled={oauthLoading !== null}
            >
              {oauthLoading === "twitter" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Twitter className="w-5 h-5 text-sky-500" />
              )}
              <span className="font-medium">Continue with Twitter</span>
            </Button>
          </div>

          <div className="relative my-8">
            <Separator className="bg-slate-200 dark:bg-slate-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white dark:bg-slate-900 px-4 text-sm text-slate-500 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isLoading}
                required
                className="h-12 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isLoading}
                required
                className="h-12 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg shadow-indigo-500/50 transition-all hover:shadow-xl mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline underline-offset-4"
            >
              Create one now
            </Link>
          </p>
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Secure login powered by NextAuth.js
        </p>
      </div>
    </div>
  );
}
