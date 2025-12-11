<<<<<<< HEAD
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FocusTimerVisualProps {
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export function FocusTimerVisual({
  elapsedSeconds,
  isRunning,
  isPaused,
}: FocusTimerVisualProps) {
  // Calculate progress for a 60-minute cycle (just for visual effect)
  // or maybe just a pulsing effect if it's open-ended.
  // Let's do a 60-second ring for the seconds and a larger one for minutes?
  // Simpler: A nice glowing ring that pulses.

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex items-center justify-center w-80 h-80 mx-auto my-8">
      {/* Outer Glow Ring */}
      <motion.div
        animate={{
          scale: isRunning ? [1, 1.05, 1] : 1,
          opacity: isRunning ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
      />

      {/* Static Background Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-muted/30" />

      {/* Progress Ring (Seconds) */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="160"
          cy="160"
          r="156"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-primary transition-all duration-1000 ease-linear"
          strokeDasharray={2 * Math.PI * 156}
          strokeDashoffset={
            2 * Math.PI * 156 * (1 - (elapsedSeconds % 60) / 60)
          }
          strokeLinecap="round"
        />
      </svg>

      {/* Inner Pulsing Circle */}
      <motion.div
        animate={{
          scale: isRunning ? [0.95, 1, 0.95] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-4 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-colors duration-500",
          isRunning
            ? "border-primary/30 bg-background/50"
            : isPaused
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-muted bg-background/50"
        )}
      >
        {/* Time Display */}
        <div className="text-center z-10">
          <div
            className={cn(
              "text-6xl font-bold font-mono tracking-wider transition-colors duration-300",
              isRunning
                ? "text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                : isPaused
                ? "text-amber-500"
                : "text-muted-foreground"
            )}
          >
            {formatTime(elapsedSeconds)}
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            {isRunning ? "Focusing" : isPaused ? "Paused" : "Ready"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
=======
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FocusTimerVisualProps {
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
}

export function FocusTimerVisual({
  elapsedSeconds,
  isRunning,
  isPaused,
}: FocusTimerVisualProps) {
  // Calculate progress for a 60-minute cycle (just for visual effect)
  // or maybe just a pulsing effect if it's open-ended.
  // Let's do a 60-second ring for the seconds and a larger one for minutes?
  // Simpler: A nice glowing ring that pulses.

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex items-center justify-center w-80 h-80 mx-auto my-8">
      {/* Outer Glow Ring */}
      <motion.div
        animate={{
          scale: isRunning ? [1, 1.05, 1] : 1,
          opacity: isRunning ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
      />

      {/* Static Background Ring */}
      <div className="absolute inset-0 rounded-full border-4 border-muted/30" />

      {/* Progress Ring (Seconds) */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="160"
          cy="160"
          r="156"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-primary transition-all duration-1000 ease-linear"
          strokeDasharray={2 * Math.PI * 156}
          strokeDashoffset={
            2 * Math.PI * 156 * (1 - (elapsedSeconds % 60) / 60)
          }
          strokeLinecap="round"
        />
      </svg>

      {/* Inner Pulsing Circle */}
      <motion.div
        animate={{
          scale: isRunning ? [0.95, 1, 0.95] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "absolute inset-4 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-colors duration-500",
          isRunning
            ? "border-primary/30 bg-background/50"
            : isPaused
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-muted bg-background/50"
        )}
      >
        {/* Time Display */}
        <div className="text-center z-10">
          <div
            className={cn(
              "text-6xl font-bold font-mono tracking-wider transition-colors duration-300",
              isRunning
                ? "text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                : isPaused
                ? "text-amber-500"
                : "text-muted-foreground"
            )}
          >
            {formatTime(elapsedSeconds)}
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
            {isRunning ? "Focusing" : isPaused ? "Paused" : "Ready"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
>>>>>>> origin/main
