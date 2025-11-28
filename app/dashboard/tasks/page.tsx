import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { TasksContainer } from "@/components/tasks/tasks-container";

export default function DashboardTasksPage() {
  return (
    <AuthWrapper>
      <div className="h-full space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <TasksContainer />
      </div>
    </AuthWrapper>
  );
}
