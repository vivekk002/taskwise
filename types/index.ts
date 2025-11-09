export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  priority: string;
  deadline?: Date | string | null;
  completed: boolean;
  isDeleted: boolean;
  tags: string[];
  estimatedDuration?: number | null;
  actualDuration?: number | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  duration: number;
  startedAt: Date | string;
  endedAt: Date | string;
  completed: boolean;
  notes?: string | null;
  createdAt: Date | string;
}

export interface TaskWithRelations extends Task {
  subtasks?: Subtask[];
  focusSessions?: FocusSession[];
  totalFocusTime?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Form types for dialogs
export interface TaskFormData {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  deadline?: Date;
  tags?: string[];
  estimatedDuration?: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Analytics types
export interface AnalyticsData {
  today: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  week: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  month: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  totalSessions: number;
  avgSessionMinutes: number;
  avgSessionSeconds: number;
  topTasks: Array<{
    title: string;
    hours: number;
    minutes: number;
    sessions: number;
  }>;
  mostFocusedTask: {
    title: string;
    hours: number;
    minutes: number;
    sessions: number;
  } | null;
}

// Session types
export interface SessionWithTask extends FocusSession {
  task: {
    id: string;
    title: string;
  };
}
