const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'] as const
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed', 'Backlog'] as const

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Backlog';
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
}

export interface Tab {
  id: string;
  name: string;
  statusFilter: string[];
  priorityFilter: string[];
  isCustom: boolean;
  sortBy?: 'priority' | 'status' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}