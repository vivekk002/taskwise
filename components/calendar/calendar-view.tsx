"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Task {
  id: string;
  title: string;
  deadline: string | null;
  completed: boolean;
  priority: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data, isLoading } = useSWR<{ tasks: Task[] }>("/api/tasks", fetcher);

  const tasks = data?.tasks || [];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      return isSameDay(new Date(task.deadline), day);
    });
  };

  const priorityColors: Record<string, string> = {
    low: "bg-sky-500",
    medium: "bg-amber-500",
    high: "bg-rose-500",
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center rounded-lg border bg-card shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-9 w-9 rounded-r-none border-r hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="h-9 rounded-none px-4 text-sm font-medium hover:bg-accent"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-9 w-9 rounded-l-none border-l hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/20">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
        {days.map((day, dayIdx) => {
          const dayTasks = getTasksForDay(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={cn(
                "min-h-[120px] border-b border-r border-border/50 p-3 transition-all hover:bg-accent/20 flex flex-col gap-2 group",
                !isSelectedMonth && "bg-muted/5 text-muted-foreground/50",
                isCurrentDay && "bg-primary/5 ring-1 ring-inset ring-primary/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-sm font-semibold h-8 w-8 flex items-center justify-center rounded-full transition-colors",
                    isCurrentDay
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground group-hover:text-foreground group-hover:bg-accent"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 h-5 font-medium bg-secondary/50"
                  >
                    {dayTasks.length}
                  </Badge>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1.5 mt-1 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => (
                  <TooltipProvider key={task.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "text-[11px] px-2 py-1 rounded-md truncate cursor-pointer border-l-[3px] bg-card shadow-sm hover:shadow-md hover:scale-[1.02] transition-all",
                            task.completed &&
                              "opacity-60 line-through decoration-muted-foreground grayscale"
                          )}
                          style={{
                            borderLeftColor:
                              task.priority === "high"
                                ? "#f43f5e"
                                : task.priority === "medium"
                                ? "#f59e0b"
                                : "#0ea5e9",
                          }}
                        >
                          {task.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="p-3">
                        <p className="font-medium">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase"
                          >
                            {task.priority}
                          </Badge>
                          {task.completed && (
                            <Badge variant="secondary" className="text-[10px]">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] font-medium text-muted-foreground pl-2 hover:text-primary cursor-pointer transition-colors">
                    + {dayTasks.length - 3} more tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
