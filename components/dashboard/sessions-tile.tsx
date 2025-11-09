"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SessionsTile() {
  return (
    <Link href="/dashboard/sessions">
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 cursor-pointer hover:shadow-lg transition-all">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Session History
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              View All Sessions
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse your complete focus session history
        </p>
      </Card>
    </Link>
  )
}
