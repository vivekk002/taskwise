export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: string;
  deadline?: Date;
  completed: boolean;
  isDeleted: boolean;
  tags: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  duration: number;
  startedAt: Date;
  endedAt: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
}
export interface TaskWithRelations {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date | null;
  order: number;
}
