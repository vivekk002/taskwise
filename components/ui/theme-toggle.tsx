"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="relative transition-colors"
    >
      <SunIcon
        className={`h-5 w-5 text-amber-500 dark:text-amber-400 transition-all ${
          mounted && resolvedTheme === "dark"
            ? "scale-100 rotate-0"
            : "scale-0 -rotate-90 absolute"
        }`}
      />
      <MoonIcon
        className={`h-5 w-5 transition-all ${
          mounted && resolvedTheme === "light"
            ? "scale-100 rotate-0"
            : "scale-0 90 absolute"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
