"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StreakCard() {
  // Mock data - replace with actual streak hook later
  const currentStreak = 7
  const streakDays = [
    { date: "2024-11-02", hasFocus: true },
    { date: "2024-11-03", hasFocus: true },
    { date: "2024-11-04", hasFocus: true },
    { date: "2024-11-05", hasFocus: true },
    { date: "2024-11-06", hasFocus: true },
    { date: "2024-11-07", hasFocus: true },
    { date: "2024-11-08", hasFocus: true },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Current Streak
          </p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
            {currentStreak}
            <span className="text-2xl ml-2">days</span>
          </p>
        </div>

        {/* Fire icons for streak days */}
        <div className="flex gap-1">
          {streakDays.map((day, index) => (
            <div
              key={day.date}
              className="flex-1 flex items-center justify-center"
              title={day.date}
            >
              {day.hasFocus ? (
                <span className="text-2xl">🔥</span>
              ) : (
                <span className="text-2xl">⚪</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Keep the focus going!
        </p>
      </div>
    </Card>
  )
}
