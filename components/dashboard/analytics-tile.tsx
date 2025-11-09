"use client"

import React, { useEffect, useState } from "react"

export function AnalyticsTile() {
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const res = await fetch("/api/analytics")
    const data = await res.json()
    setTotalFocusMinutes(Math.floor(data.totalFocusSeconds / 60))
    setSessionCount(data.sessionCount)
  }

  return (
    <div className="p-6 rounded bg-white dark:bg-gray-800 shadow">
      <h3 className="text-xl font-bold mb-4">Today's Focus</h3>
      <p>Total Focus Time: {totalFocusMinutes} minutes</p>
      <p>Sessions Today: {sessionCount}</p>
    </div>
  )
}
