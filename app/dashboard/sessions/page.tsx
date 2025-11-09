"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  Download,
  Filter,
  X,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { toast } from "sonner";

interface Session {
  id: string;
  duration: number;
  startedAt: string;
  endedAt: string;
  notes: string | null;
  completed: boolean;
  task: {
    id: string;
    title: string;
    priority: string | null;
  };
}

type DateFilter = "all" | "today" | "week" | "month";
type GroupBy = "date" | "task";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [groupBy, setGroupBy] = useState<GroupBy>("date");
  const [selectedTask, setSelectedTask] = useState<string>("all");
  const [tasks, setTasks] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);

        // Extract unique tasks
        const uniqueTasks = Array.from(
          new Map(data.map((s: Session) => [s.task.id, s.task])).values()
        );
        setTasks(uniqueTasks as Array<{ id: string; title: string }>);
      } else {
        toast.error("Failed to load sessions");
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const filterSessionsByDate = (sessions: Session[]): Session[] => {
    const now = new Date();

    switch (dateFilter) {
      case "today":
        return sessions.filter((s) => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate.toDateString() === now.toDateString();
        });

      case "week":
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return sessions.filter((s) => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });

      case "month":
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return sessions.filter((s) => {
          const sessionDate = new Date(s.startedAt);
          return sessionDate >= monthStart && sessionDate <= monthEnd;
        });

      default:
        return sessions;
    }
  };

  const filterSessionsByTask = (sessions: Session[]): Session[] => {
    if (selectedTask === "all") return sessions;
    return sessions.filter((s) => s.task.id === selectedTask);
  };

  const filteredSessions = filterSessionsByTask(filterSessionsByDate(sessions));

  const groupSessions = (sessions: Session[]) => {
    if (groupBy === "date") {
      const grouped: Record<string, Session[]> = {};
      sessions.forEach((session) => {
        const dateKey = format(new Date(session.startedAt), "yyyy-MM-dd");
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(session);
      });
      return grouped;
    } else {
      const grouped: Record<string, Session[]> = {};
      sessions.forEach((session) => {
        const taskKey = session.task.id;
        if (!grouped[taskKey]) {
          grouped[taskKey] = [];
        }
        grouped[taskKey].push(session);
      });
      return grouped;
    }
  };

  const groupedSessions = groupSessions(filteredSessions);

  const exportToCSV = () => {
    const headers = ["Date", "Task", "Duration (minutes)", "Notes"];
    const rows = filteredSessions.map((s) => [
      format(new Date(s.startedAt), "yyyy-MM-dd HH:mm"),
      s.task.title,
      Math.floor(s.duration / 60).toString(),
      s.notes || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focus-sessions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Sessions exported to CSV");
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = filteredSessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  const totalSessions = filteredSessions.length;
  const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

  const handleClearFilters = () => {
    setDateFilter("all");
    setSelectedTask("all");
    setGroupBy("date");
    toast.info("Filters cleared");
  };

  const isFiltered =
    dateFilter !== "all" || selectedTask !== "all" || groupBy !== "date";

  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    medium:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Focus Sessions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track and analyze your focus time
          </p>
        </div>
        <Button onClick={exportToCSV} disabled={filteredSessions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/30 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Total Focus Time
              </p>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatTime(totalDuration)}
              </h3>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 dark:bg-green-950/30 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Total Sessions
              </p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalSessions}
              </h3>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Timer className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-50 dark:bg-purple-950/30 border-none">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Average Duration
              </p>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatDuration(avgDuration)}
              </h3>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filters
          </span>
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 text-xs gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Time Period
            </label>
            <Select
              value={dateFilter}
              onValueChange={(value) => setDateFilter(value as DateFilter)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Task
            </label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Group By */}
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
              Group By
            </label>
            <Select
              value={groupBy}
              onValueChange={(value) => setGroupBy(value as GroupBy)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="task">By Task</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            No sessions found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isFiltered
              ? "Try adjusting your filters"
              : "Start a focus session to see it here"}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([key, groupSessions]) => {
            const groupTotal = groupSessions.reduce(
              (sum, s) => sum + s.duration,
              0
            );
            const groupTitle =
              groupBy === "date"
                ? format(
                    new Date(groupSessions[0].startedAt),
                    "EEEE, MMMM d, yyyy"
                  )
                : groupSessions[0].task.title;

            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {groupBy === "date" ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Timer className="w-5 h-5" />
                    )}
                    {groupTitle}
                  </h3>
                  <Badge variant="secondary" className="font-mono">
                    {formatTime(groupTotal)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {groupSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {groupBy === "date" && (
                              <p className="font-medium text-slate-900 dark:text-white">
                                {session.task.title}
                              </p>
                            )}
                            {session.task.priority && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  priorityColors[
                                    session.task.priority.toLowerCase()
                                  ]
                                }`}
                              >
                                {session.task.priority}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {format(new Date(session.startedAt), "h:mm a")} -{" "}
                            {format(new Date(session.endedAt), "h:mm a")}
                          </p>
                          {session.notes && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">
                              "{session.notes}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold font-mono text-green-600 dark:text-green-400">
                            {formatTime(session.duration)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
