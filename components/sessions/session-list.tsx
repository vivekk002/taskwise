"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FocusSession {
  id: string;
  taskId: string;
  duration: number;
  startedAt: string;
  endedAt: string;
  notes?: string;
  completed: boolean;
}

export function SessionList() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sessions");

      if (!res.ok) {
        throw new Error(`Failed to fetch sessions: ${res.status}`);
      }

      const text = await res.text();

      if (!text) {
        setSessions([]);
        return;
      }

      const data = JSON.parse(text);
      setSessions(data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          No focus sessions found. Start a session to see it here!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Session History
      </h2>
      {sessions.map((session) => (
        <Card
          key={session.id}
          className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Task ID
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {session.taskId}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Duration
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {Math.round(session.duration / 60)} minutes
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Started
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(session.startedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ended
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                {new Date(session.endedAt).toLocaleString()}
              </p>
            </div>
          </div>
          {session.notes && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Notes
              </p>
              <p className="text-slate-900 dark:text-white">{session.notes}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
