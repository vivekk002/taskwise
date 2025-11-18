"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setMessage("Verification token is missing.");
        setError(true);
        return;
      }

      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setMessage("Email successfully verified! Redirecting to signin...");
          setTimeout(() => router.push("/auth/signin"), 3000);
        } else {
          setMessage(data.error || "Verification failed.");
          setError(true);
        }
      } catch {
        setMessage("An error occurred during verification.");
        setError(true);
      }
    }

    verify();
  }, [token, router]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      <p className={error ? "text-red-600" : "text-green-600"}>{message}</p>
    </div>
  );
}
