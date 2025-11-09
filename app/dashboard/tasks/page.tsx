import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { TasksContainer } from "@/components/tasks/tasks-container"

export default function DashboardTasksPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-6">Dashboard - Tasks</h1>
        <TasksContainer />
      </div>
    </AuthWrapper>
  )
}
