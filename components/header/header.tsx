"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MobileSidebar } from "@/components/sidebar/mobile-sidebar";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Generate breadcrumbs
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join("/")}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;

    return { href, label, isLast };
  });

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border/50 px-6 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileSidebar />

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/dashboard"
              prefetch={true}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                {crumb.isLast ? (
                  <span className="text-foreground font-medium">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    prefetch={true}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400 transition-all" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground transition-all" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 pl-2 pr-4 rounded-full hover:bg-secondary border border-transparent hover:border-border/50 cursor-pointer"
              >
                <Avatar className="w-8 h-8 border border-border/50">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium hidden md:inline-block text-foreground">
                    {user.name || "User"}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 glass border-border/50 bg-card"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <div className="px-2 pb-2 text-xs text-muted-foreground truncate">
                {user.email}
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
