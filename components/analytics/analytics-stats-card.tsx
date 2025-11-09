import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ReactNode } from "react"

interface AnalyticsStatsCardProps {
  title: string
  hours: number
  minutes: number
  icon: string
  color: string
  href?: string
}

export function AnalyticsStatsCard({
  title,
  hours,
  minutes,
  icon,
  color,
  href,
}: AnalyticsStatsCardProps) {
  const content = (
    <Card className={`p-6 ${color} border cursor-pointer hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {hours}
            <span className="text-xl ml-2">h</span> {minutes}
            <span className="text-xl ml-1">m</span>
          </p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
