<<<<<<< HEAD
"use client";

import React from "react";
import useSWR from "swr";
import { Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserGamificationData {
  xp: number;
  level: number;
  currentStreak: number;
  nextLevelThreshold: number;
}

export function UserLevelWidget() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR<UserGamificationData>(
    "/api/user/gamification",
    fetcher
  );

  if (error) return null;
  // Or a skeleton loader

  if (!data) return null;

  const progress =
    ((data.xp - (data.level === 1 ? 0 : 100)) / // Simplified progress calc for demo
      (data.nextLevelThreshold - (data.level === 1 ? 0 : 100))) *
    100;

  // Safe progress calculation
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="px-4 py-2">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Level
              </p>
              <p className="text-xl font-black leading-none bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {data.level}
              </p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/10 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-800/30 shadow-sm hover:scale-105 transition-transform cursor-help">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse drop-shadow-sm" />
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                    {data.currentStreak}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-semibold">
                  🔥 {data.currentStreak} day streak!
                </p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="text-primary">
              {data.xp}{" "}
              <span className="text-muted-foreground">
                / {data.nextLevelThreshold}
              </span>
            </span>
          </div>
          <Progress value={safeProgress} className="h-2 bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}
=======
"use client";

import React from "react";
import useSWR from "swr";
import { Flame, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserGamificationData {
  xp: number;
  level: number;
  currentStreak: number;
  nextLevelThreshold: number;
}

export function UserLevelWidget() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR<UserGamificationData>(
    "/api/user/gamification",
    fetcher
  );

  if (error) return null;
  // Or a skeleton loader

  if (!data) return null;

  const progress =
    ((data.xp - (data.level === 1 ? 0 : 100)) / // Simplified progress calc for demo
      (data.nextLevelThreshold - (data.level === 1 ? 0 : 100))) *
    100;

  // Safe progress calculation
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="px-4 py-2">
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50 space-y-4 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5 drop-shadow-sm" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                Level
              </p>
              <p className="text-xl font-black leading-none bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {data.level}
              </p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/10 px-3 py-1.5 rounded-full border border-orange-100 dark:border-orange-800/30 shadow-sm hover:scale-105 transition-transform cursor-help">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse drop-shadow-sm" />
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                    {data.currentStreak}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="font-semibold">
                  🔥 {data.currentStreak} day streak!
                </p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="text-primary">
              {data.xp}{" "}
              <span className="text-muted-foreground">
                / {data.nextLevelThreshold}
              </span>
            </span>
          </div>
          <Progress value={safeProgress} className="h-2 bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}
>>>>>>> origin/main
