export type TaskPriority = "Low" | "Medium" | "High"
export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Backlog"

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: number
  updatedAt: number
  completedAt: number | null
  themeId?: string
}

export interface Tab {
  id: string
  name: string
  statusFilter: TaskStatus[]
  priorityFilter: TaskPriority[]
  isCustom: boolean
  sortBy?: "priority" | "status" | "createdAt" | "updatedAt"
  sortOrder?: "asc" | "desc"
}

export interface Theme {
  id: string;
  name: string;
  // Add other theme properties as needed
}

