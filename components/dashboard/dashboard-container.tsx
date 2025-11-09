"use client"

import { TodayFocusCard } from "./today-focus-card"
import { StreakCard } from "./streak-card"
import { SessionsTile } from "./sessions-tile"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Zap, Sparkles } from "lucide-react"
import { useAnalyticsOverview } from "@/hooks/use-analytics-overview"
import { Skeleton } from "@/components/ui/skeleton"
import { useMemo } from "react"

interface DashboardContainerProps {
  userId: string
}

export function DashboardContainer({ userId }: DashboardContainerProps) {
  const { data, isLoading } = useAnalyticsOverview(30000)

  const quickStats = useMemo(() => {
    if (!data) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Total Sessions
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {data.totalSessions}
          </p>
        </Card>

        <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Most Focused Task
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {data.mostFocusedTask?.title || "N/A"}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {data.mostFocusedTask?.hours || 0}h {data.mostFocusedTask?.minutes || 0}m
          </p>
        </Card>

        <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Avg Session
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {data.avgSessionMinutes}m
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {data.avgSessionSeconds}s
          </p>
        </Card>

        <Card className="p-6 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Last Updated
          </p>
          <p className="text-xs text-slate-900 dark:text-white font-mono">
            {new Date().toLocaleTimeString()}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Auto-refresh every 30s
          </p>
        </Card>
      </div>
    )
  }, [data])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Your productivity at a glance
        </p>
      </div>

      {/* Today's Focus */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Todays Progress
        </h2>
        <TodayFocusCard />
      </div>

      {/* Engagement History */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Engagement History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StreakCard />
          <SessionsTile />
        </div>
      </div>

      {/* Quick Stats */}
      {!isLoading && data && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          {quickStats}
        </div>
      )}

      {isLoading && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ready to focus?
            </h3>
            <p className="text-blue-100">
              Start a focus session and track your productivity
            </p>
          </div>
          <Link href="/dashboard/tasks">
            <Button className="gap-2 bg-white text-blue-600 hover:bg-blue-50">
              <Zap className="w-5 h-5" />
              Let's hit it.!
            </Button>
          </Link>
        </div>
      </div>

      {/* Info Box */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Pro Tip:</strong> Click on Today's Focus card to access detailed
          analytics with interactive graphs and trends!
        </p>
      </Card>
    </div>
  )
}
