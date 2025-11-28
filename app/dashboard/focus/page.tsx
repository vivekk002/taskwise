"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const SOUNDSCAPES = [
  { id: "none", name: "None", url: "" },
  {
    id: "rain",
    name: "Rain",
    url: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3",
  },
  {
    id: "forest",
    name: "Forest",
    url: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3",
  },
  {
    id: "white-noise",
    name: "White Noise",
    url: "https://assets.mixkit.co/sfx/preview/mixkit-white-noise-1234.mp3",
  },
];

export default function FocusPage() {
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

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const hasAutoStarted = useRef(false);

  // Soundscape state
  const [selectedSound, setSelectedSound] = useState<string>("none");
  const [volume, setVolume] = useState<number>(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timerRunning = isTimerRunning();
  const currentElapsed = activeTimer?.elapsedSeconds || 0;
  const currentNotes = activeTimer?.notes || "";
  const isPaused = activeTimer && !timerRunning;

  useEffect(() => {
    fetchActiveTasks();
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    audio.volume = volume / 100;

    const sound = SOUNDSCAPES.find((s) => s.id === selectedSound);

    if (sound && sound.url) {
      if (audio.src !== sound.url) {
        audio.src = sound.url;
      }

      if (timerRunning) {
        audio.play().catch((e) => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.src = "";
    }

    return () => {
      audio.pause();
    };
  }, [selectedSound, timerRunning]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle task selection from URL and auto-start
  useEffect(() => {
    if (taskIdFromUrl && tasks.length > 0 && !isLoading) {
      const taskExists = tasks.find((t) => t.id === taskIdFromUrl);

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
    try {
      setIsLoading(true);
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();

        let tasksData = [];
        if (data.tasks && Array.isArray(data.tasks)) {
          tasksData = data.tasks;
        } else if (Array.isArray(data)) {
          tasksData = data;
        }

        const activeTasks = tasksData.filter((t: Task) => !t.completed);
        setTasks(activeTasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
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
    low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    medium:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
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
      <Card className="p-8 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-2 glass relative z-10">
        <div className="text-center space-y-6">
          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {activeTimer ? activeTimer.taskTitle : "Ready to Focus"}
            </h3>
            {isPaused && (
              <span className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                Paused
              </span>
            )}
            {timerRunning && (
              <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full animate-pulse">
                Running
              </span>
            )}
          </div>

          {/* Timer */}
          <div className="text-8xl font-bold font-mono text-foreground">
            {formatTime(currentElapsed)}
          </div>

          {/* Soundscapes Control */}
          <div className="max-w-md mx-auto bg-secondary/50 p-4 rounded-lg backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs font-medium mb-1.5 block text-left flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  Soundscape
                </Label>
                <Select value={selectedSound} onValueChange={setSelectedSound}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOUNDSCAPES.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32 space-y-1.5 ">
                <Label className="text-xs font-medium block text-left flex items-center gap-1">
                  {volume === 0 ? (
                    <VolumeX className="w-3 h-3  " />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                  Volume
                </Label>
                <Slider
                  value={[volume]}
                  onValueChange={(vals) => setVolume(vals[0])}
                  max={100}
                  step={1}
                  className="py-1 "
                />
              </div>
            </div>
          </div>

          {/* Task Selection (only show when no active timer) */}
          {!activeTimer && (
            <div className="max-w-md mx-auto relative z-0">
              <Label
                htmlFor="task-select"
                className="text-sm font-medium mb-2 block"
              >
                Select a Task
              </Label>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger id="task-select" className="w-full">
                  <SelectValue placeholder="Choose a task to focus on..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No active tasks available
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <div className="flex items-center gap-2">
                          <span>{task.title}</span>
                          {task.priority && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                priorityColors[task.priority.toLowerCase()]
                              }`}
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
          <div className="flex justify-center gap-3 flex-wrap">
            {!activeTimer ? (
              <Button
                size="lg"
                onClick={handleStart}
                className="gap-2 px-8"
                disabled={isLoading || !selectedTaskId}
              >
                <Play className="w-6 h-6" />
                Start Focus Session
              </Button>
            ) : timerRunning ? (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handlePause}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Pause className="w-6 h-6" />
                  {isSaving ? "Saving..." : "Pause"}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleStopAndSave}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <StopCircle className="w-6 h-6" />
                  {isSaving ? "Saving..." : "Complete Session"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={handleResume}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Play className="w-6 h-6" />
                  Resume
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleStopAndSave}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <StopCircle className="w-6 h-6" />
                  {isSaving ? "Saving..." : "Complete Session"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDiscard}
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                  disabled={isSaving}
                >
                  <XCircle className="w-6 h-6" />
                  Discard
                </Button>
              </>
            )}
          </div>

          {/* Notes */}
          {activeTimer && (
            <div className="max-w-2xl mx-auto space-y-2 text-left">
              <Label htmlFor="notes" className="text-sm font-medium">
                Session Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this focus session..."
                value={currentNotes}
                onChange={(e) => updateNotes(e.target.value)}
                rows={3}
                disabled={isSaving}
                className="resize-none bg-white dark:bg-gray-900"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Active Tasks List */}
      {!activeTimer && tasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Active Tasks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.slice(0, 6).map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "p-4 hover:bg-secondary/50 transition-colors cursor-pointer glass border-border/50",
                  selectedTaskId === task.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.priority && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            priorityColors[task.priority.toLowerCase()]
                          }`}
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.deadline && (
                        <span className="text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
