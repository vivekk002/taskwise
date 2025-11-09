import { useState, useEffect } from "react"

interface AnalyticsData {
  today: {
    hours: number
    minutes: number
    seconds: number
  }
  week: {
    hours: number
    minutes: number
    seconds: number
  }
  month: {
    hours: number
    minutes: number
    seconds: number
  }
  totalSessions: number
  avgSessionMinutes: number
  avgSessionSeconds: number
  topTasks: Array<{
    title: string
    hours: number
    minutes: number
    sessions: number
  }>
  mostFocusedTask: {
    title: string
    hours: number
    minutes: number
    sessions: number
  } | null
}

export function useAnalyticsOverview(refreshInterval: number = 30000) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const analyticsData = await response.json()
        setData(analyticsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return { data, isLoading, error }
}
