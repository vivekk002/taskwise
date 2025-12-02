"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Play,
  Pause,
  StopCircle,
  Timer,
  Clock,
  CheckCircle2,
  Circle,
  XCircle,
  ArrowLeft,
  ClipboardList,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTimer } from "@/contexts/timer-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  priority: string | null;
  completed: boolean;
  deadline: string | null;
}

import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function FocusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskIdFromUrl = searchParams.get("taskId");

  const {
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    discardTimer,
    updateNotes,
    isTimerRunning,
  } = useTimer();

  const {
    data,
    error,
    isLoading: swrLoading,
  } = useSWR<{ tasks: Task[] }>("/api/tasks", fetcher);

  const allTasks = data?.tasks || (Array.isArray(data) ? data : []) || [];
  const tasks = allTasks.filter((t: Task) => !t.completed);

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const hasAutoStarted = useRef(false);

  const timerRunning = isTimerRunning();
  const currentElapsed = activeTimer?.elapsedSeconds || 0;
  const currentNotes = activeTimer?.notes || "";
  const isPaused = activeTimer && !timerRunning;
  const isLoading = swrLoading;

  // Handle task selection from URL and auto-start
  useEffect(() => {
    if (taskIdFromUrl && tasks.length > 0 && !isLoading) {
      const taskExists = tasks.find((t: Task) => t.id === taskIdFromUrl);

      if (taskExists) {
        setSelectedTaskId(taskIdFromUrl);

        // Auto-start logic
        const shouldAutoStart =
          !hasAutoStarted.current && // Haven't auto-started yet
          (!activeTimer || activeTimer.taskId !== taskIdFromUrl); // No timer or different task

        if (shouldAutoStart) {
          hasAutoStarted.current = true;
          handleStartWithTask(taskIdFromUrl);
        }
      }
    }
  }, [taskIdFromUrl, tasks, isLoading, activeTimer]);

  // Reset auto-start flag when URL changes
  useEffect(() => {
    hasAutoStarted.current = false;
  }, [taskIdFromUrl]);

  const fetchActiveTasks = async () => {
    await mutate("/api/tasks");
  };

  const handleStartWithTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      await startTimer(taskId, task.title);
      toast.success("Focus timer started!", {
        description: task.title,
      });
    } catch (error) {
      console.error("Failed to start timer:", error);
      toast.error("Failed to start timer");
    }
  };

  const handleStart = async () => {
    if (!selectedTaskId) {
      toast.error("Please select a task first");
      return;
    }
    await handleStartWithTask(selectedTaskId);
  };

  const handlePause = async () => {
    setIsSaving(true);
    try {
      await pauseTimer();
    } finally {
      setIsSaving(false);
    }
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStopAndSave = async () => {
    setIsSaving(true);
    try {
      const elapsed = activeTimer?.elapsedSeconds || 0;
      await stopAndSaveTimer();
      await fetchActiveTasks();
      toast.success("Focus session completed!", {
        description: `${formatTime(elapsed)} recorded`,
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#ec4899"],
      });
      setSelectedTaskId("");
      hasAutoStarted.current = false;

      // Clear URL params
      router.push("/dashboard/focus");
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to save focus session");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    if (confirm("Are you sure you want to discard this session?")) {
      await discardTimer();
      setSelectedTaskId("");
      hasAutoStarted.current = false;
      router.push("/dashboard/focus");
      toast.info("Session discarded");
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const priorityColors: Record<string, string> = {
    low: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    medium:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    high: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
  };

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isZenMode
          ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-8"
          : "max-w-4xl mx-auto space-y-6 relative min-h-[80vh] flex flex-col justify-center"
      )}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: timerRunning
              ? "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, rgba(0, 0, 0, 0) 70%)"
              : "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full"
        />
        <motion.div
          animate={{
            scale: timerRunning ? [1, 1.2, 1] : 1,
            opacity: timerRunning ? 0.3 : 0.1,
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Zen Mode Toggle */}
      <div
        className={cn(
          "absolute z-50 transition-all duration-500",
          isZenMode ? "top-6 right-6" : "top-0 right-0"
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsZenMode(!isZenMode)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isZenMode
                    ? "bg-background/20 hover:bg-background/40 text-foreground backdrop-blur-md h-12 w-12"
                    : "hover:bg-muted h-10 w-10 text-muted-foreground hover:text-foreground"
                )}
              >
                {isZenMode ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Header with Back Button (Hidden in Zen Mode) */}
      <div
        className={cn(
          "flex items-center gap-4 transition-all duration-500 origin-top",
          isZenMode
            ? "opacity-0 -translate-y-10 scale-95 pointer-events-none absolute"
            : "opacity-100 translate-y-0 scale-100"
        )}
      >
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Timer className="w-8 h-8" />
            Focus Timer
          </h1>
          <p className="text-muted-foreground mt-1">
            Select a task and start focusing
          </p>
        </div>
      </div>

      {/* Timer Display */}
      <Card
        className={cn(
          "p-10 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border-2 glass relative z-10 transition-all duration-700 backdrop-blur-xl shadow-2xl",
          isZenMode
            ? "border-none shadow-none bg-transparent dark:bg-transparent scale-110"
            : "hover:shadow-primary/10 hover:border-primary/20"
        )}
      >
        <div className="text-center space-y-8">
          {/* Status */}
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              {activeTimer ? activeTimer.taskTitle : "Ready to Focus"}
            </h3>
            {isPaused && (
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-sm"
              >
                Paused
              </Badge>
            )}
            {timerRunning && (
              <Badge
                variant="secondary"
                className="px-3 py-1 text-sm font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 animate-pulse shadow-sm"
              >
                Running
              </Badge>
            )}
          </div>

          {/* Timer */}
          <div className="transform scale-110 transition-transform duration-500">
            <FocusTimerVisual
              elapsedSeconds={currentElapsed}
              isRunning={timerRunning}
              isPaused={isPaused || false}
            />
          </div>

          {/* Task Selection (only show when no active timer) */}
          {!activeTimer && (
            <div className="relative z-10 max-w-md mx-auto">
              <Label className="text-base font-semibold mb-4 block text-center text-muted-foreground/80">
                What would you like to focus on today?
              </Label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="w-full h-14 text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:ring-primary/20 transition-all shadow-sm hover:shadow-md hover:border-primary/30">
                  <SelectValue placeholder="Select a task..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {tasks.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No pending tasks found
                    </div>
                  ) : (
                    tasks.map((task: Task) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                        className="py-3 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="truncate font-medium">
                            {task.title}
                          </span>
                          {task.priority && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-[10px] uppercase tracking-wider h-5 px-1.5",
                                priorityColors[task.priority.toLowerCase()]
                              )}
                            >
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-4 flex-wrap items-center pt-4">
            {!activeTimer ? (
              <Button
                size="lg"
                onClick={handleStart}
                className="gap-3 px-10 h-14 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 group"
                disabled={isLoading || !selectedTaskId}
              >
                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                Start Focus Session
              </Button>
            ) : timerRunning ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePause}
                  className="gap-2 h-12 px-6 rounded-full border-2 hover:bg-secondary/80 transition-all"
                  disabled={isSaving}
                >
                  <Pause className="w-5 h-5 fill-current" />
                  {isSaving ? "Saving..." : "Pause"}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleStopAndSave}
                  className="gap-2 h-12 px-6 rounded-full shadow-lg shadow-destructive/20 hover:shadow-destructive/30 hover:scale-105 transition-all"
                  disabled={isSaving}
                >
                  <StopCircle className="w-5 h-5 fill-current" />
                  {isSaving ? "Saving..." : "Complete"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={handleResume}
                  className="gap-2 h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all"
                  disabled={isSaving}
                >
                  <Play className="w-5 h-5 fill-current" />
                  Resume
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleStopAndSave}
                  className="gap-2 h-12 px-6 rounded-full shadow-lg shadow-destructive/20 hover:shadow-destructive/30 hover:scale-105 transition-all"
                  disabled={isSaving}
                >
                  <StopCircle className="w-5 h-5 fill-current" />
                  {isSaving ? "Saving..." : "Complete"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDiscard}
                  className="gap-2 h-12 px-6 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-all"
                  disabled={isSaving}
                >
                  <XCircle className="w-5 h-5" />
                  Discard
                </Button>
              </>
            )}
          </div>

          {/* Notes */}
          {activeTimer && !isZenMode && (
            <div className="max-w-xl mx-auto space-y-3 text-left pt-4 border-t border-border/50">
              <Label
                htmlFor="notes"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                Session Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Jot down your thoughts, distractions, or accomplishments..."
                value={currentNotes}
                onChange={(e) => updateNotes(e.target.value)}
                rows={3}
                disabled={isSaving}
                className="resize-none bg-background/50 focus:bg-background transition-all border-border/50 focus:border-primary/50"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-900 rounded">
          <h2 className="text-lg font-bold">Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <pre className="text-xs mt-2 overflow-auto">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

import { FocusPageSkeleton } from "@/components/skeletons/focus-page-skeleton";

import { FocusTimerVisual } from "@/components/focus/focus-timer-visual";

export default function FocusPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FocusPageSkeleton />}>
        <FocusContent />
      </Suspense>
    </ErrorBoundary>
  );
}
