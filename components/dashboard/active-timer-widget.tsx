"use client";

import React, { useState, useEffect } from "react";
import { Timer, Play, Pause, StopCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/contexts/timer-context";
import { useRouter } from "next/navigation";

export function ActiveTimerWidget() {
  const { activeTimer, pauseTimer, resumeTimer, isTimerRunning, getElapsedSeconds } = useTimer();
  const [elapsed, setElapsed] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (activeTimer) {
      const interval = setInterval(() => {
        setElapsed(getElapsedSeconds());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTimer, getElapsedSeconds]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!activeTimer) {
    return null;
  }

  const isRunning = isTimerRunning();

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-white/20 rounded-lg ${isRunning ? 'animate-pulse' : ''}`}>
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">
              {isRunning ? "Focus Timer Running" : "Timer Paused"}
            </p>
            <h3 className="text-2xl font-bold font-mono">{formatTime(elapsed)}</h3>
            <p className="text-sm opacity-75 mt-1 truncate max-w-[200px]">
              {activeTimer.taskTitle}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={pauseTimer}
              className="gap-1"
            >
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={resumeTimer}
              className="gap-1"
            >
              <Play className="w-4 h-4" />
              Resume
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboard/tasks")}
            className="gap-1"
          >
            View Task
          </Button>
        </div>
      </div>
    </Card>
  );
}
