import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { TasksContainer } from "@/components/tasks/tasks-container";

export default function DashboardTasksPage() {
  return (
    <AuthWrapper>
      <div className="h-full space-y-6">
        <TasksContainer />
      </div>
    </AuthWrapper>
  );
}
