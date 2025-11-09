"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
        className: "sonner-toast",
      }}
      gap={8}
      offset={16}
    />
  );
}
