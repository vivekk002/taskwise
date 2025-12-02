"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        router.push("/auth/signin");
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong");
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
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-3xl mb-4 shadow-2xl shadow-primary/20 animate-pulse-subtle">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
          Create Account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join Taskwise and boost your productivity
        </p>
      </div>

      <Card className="p-6 shadow-xl glass border-border/50">
        <div className="flex justify-center gap-3 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all"
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
            className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all"
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
            className="w-12 h-10 rounded-xl hover:bg-secondary hover:border-primary/50 transition-all"
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
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isLoading}
              required
              className="h-10 border-2 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address <span className="text-destructive">*</span>
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
              className="h-10 border-2 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
              required
              className="h-10 border-2 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="profession"
              className="text-sm font-semibold flex items-center gap-1"
            >
              Profession
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-muted-foreground font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="profession"
              type="text"
              placeholder="Software Developer, Designer, etc."
              value={formData.profession}
              onChange={(e) =>
                setFormData({ ...formData, profession: e.target.value })
              }
              disabled={isLoading}
              className="h-10 border-2 transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-primary hover:text-primary/80 underline underline-offset-4 transition-colors cursor-pointer"
          >
            Sign in here
          </Link>
        </p>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-4">
        By creating an account, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
}
