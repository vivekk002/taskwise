"use client"

import React, { useEffect, useState } from "react"

interface FocusSession {
  id: string
  taskId: string
  duration: number
  startedAt: string
  endedAt: string
  notes?: string
  completed: boolean
}

export function SessionList() {
  const [sessions, setSessions] = useState<FocusSession[]>([])

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    const res = await fetch("/api/sessions")
    const data = await res.json()
    setSessions(data)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Session History</h2>
      {sessions.length === 0 && <p>No sessions found.</p>}
      {sessions.map((session) => (
        <div key={session.id} className="border p-4 rounded bg-white dark:bg-gray-800">
          <div>
            <strong>Task ID:</strong> {session.taskId}
          </div>
          <div>
            <strong>Duration:</strong> {Math.round(session.duration / 60)} minutes
          </div>
          <div>
            <strong>Start:</strong> {new Date(session.startedAt).toLocaleString()}
          </div>
          <div>
            <strong>End:</strong> {new Date(session.endedAt).toLocaleString()}
          </div>
          {session.notes && (
            <div>
              <strong>Notes:</strong> {session.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
