"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { toast } from "sonner";

interface TimerState {
  taskId: string;
  taskTitle: string;
  startTime: Date;
  elapsedSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  notes: string;
  sessionId: string | null; // Track the database session ID
}

interface TimerContextType {
  activeTimer: TimerState | null;
  startTimer: (
    taskId: string,
    taskTitle: string,
    onPreviousTimerSave?: (timer: TimerState) => Promise<void>
  ) => Promise<void>;
  pauseTimer: () => Promise<void>;
  resumeTimer: () => void;
  stopAndSaveTimer: () => Promise<void>;
  discardTimer: () => Promise<void>;
  updateNotes: (notes: string) => void;
  isTimerActive: (taskId?: string) => boolean;
  isTimerRunning: (taskId?: string) => boolean;
  getElapsedSeconds: (taskId?: string) => number;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const STORAGE_KEY = "taskwise_active_timer";

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTimer, setActiveTimer] = useState<TimerState | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedTimer = localStorage.getItem(STORAGE_KEY);
    if (savedTimer) {
      try {
        const parsed = JSON.parse(savedTimer);
        setActiveTimer({
          ...parsed,
          startTime: new Date(parsed.startTime),
          isRunning: false,
          isPaused: true,
        });
      } catch (error) {
        console.error("Failed to restore timer:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      if (activeTimer) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTimer));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [activeTimer, isInitialized]);

  // Update elapsed time every second when timer is running
  useEffect(() => {
    if (activeTimer?.isRunning) {
      intervalRef.current = setInterval(() => {
        setActiveTimer((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1,
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer?.isRunning]);

  const createOrUpdateSession = async (
    timer: TimerState,
    completed: boolean = false
  ): Promise<string | null> => {
    try {
      if (timer.sessionId) {
        // Update existing session
        const res = await fetch(`/api/sessions/${timer.sessionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            duration: timer.elapsedSeconds,
            endedAt: new Date().toISOString(),
            notes: timer.notes || null,
            completed,
          }),
        });

        if (res.ok) {
          return timer.sessionId;
        }
      } else {
        // Create new session
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId: timer.taskId,
            duration: timer.elapsedSeconds,
            startedAt: timer.startTime.toISOString(),
            endedAt: new Date().toISOString(),
            notes: timer.notes || null,
            completed,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return data.id;
        }
      }
    } catch (error) {
      console.error("Failed to save session:", error);
      toast.error("Failed to save session");
    }
    return null;
  };

  const startTimer = async (
    taskId: string,
    taskTitle: string,
    onPreviousTimerSave?: (timer: TimerState) => Promise<void>
  ) => {
    // If there's an existing timer for a different task, finalize it
    if (
      activeTimer &&
      activeTimer.taskId !== taskId &&
      activeTimer.elapsedSeconds > 0
    ) {
      await createOrUpdateSession(activeTimer, true);
      toast.success("Previous session saved", {
        description: `${activeTimer.taskTitle} - ${Math.floor(
          activeTimer.elapsedSeconds / 60
        )}m`,
      });
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setActiveTimer({
      taskId,
      taskTitle,
      startTime: new Date(),
      elapsedSeconds: 0,
      isRunning: true,
      isPaused: false,
      notes: "",
      sessionId: null,
    });
  };

  const pauseTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (activeTimer && activeTimer.elapsedSeconds > 0) {
      // Save/update session when pausing
      const sessionId = await createOrUpdateSession(activeTimer, false);

      setActiveTimer((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isRunning: false,
          isPaused: true,
          sessionId: sessionId || prev.sessionId,
        };
      });

      toast.success("Session saved", {
        description: `${Math.floor(
          activeTimer.elapsedSeconds / 60
        )} minutes recorded`,
      });
    } else {
      setActiveTimer((prev) => {
        if (!prev) return null;
        return { ...prev, isRunning: false, isPaused: true };
      });
    }
  };

  const resumeTimer = () => {
    setActiveTimer((prev) => {
      if (!prev) return null;
      return { ...prev, isRunning: true, isPaused: false };
    });
    toast.info("Timer resumed");
  };

  const stopAndSaveTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (activeTimer && activeTimer.elapsedSeconds > 0) {
      await createOrUpdateSession(activeTimer, true);
    }

    setActiveTimer(null);
  };

  const discardTimer = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If there's a session ID, delete it from database
    if (activeTimer?.sessionId) {
      try {
        await fetch(`/api/sessions/${activeTimer.sessionId}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    }

    setActiveTimer(null);
  };

  const updateNotes = (notes: string) => {
    setActiveTimer((prev) => {
      if (!prev) return null;
      return { ...prev, notes };
    });
  };

  const isTimerActive = (taskId?: string) => {
    if (!activeTimer) return false;
    if (taskId) return activeTimer.taskId === taskId;
    return true;
  };

  const isTimerRunning = (taskId?: string) => {
    if (!activeTimer) return false;
    if (taskId) return activeTimer.taskId === taskId && activeTimer.isRunning;
    return activeTimer.isRunning;
  };

  const getElapsedSeconds = (taskId?: string) => {
    if (!activeTimer) return 0;
    if (taskId && activeTimer.taskId !== taskId) return 0;
    return activeTimer.elapsedSeconds;
  };

  return (
    <TimerContext.Provider
      value={{
        activeTimer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndSaveTimer,
        discardTimer,
        updateNotes,
        isTimerActive,
        isTimerRunning,
        getElapsedSeconds,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
