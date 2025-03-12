import { Task, Tab } from './types';

// Filter tasks based on tab criteria
export const filterTasks = (tasks: Task[], tab: Tab): Task[] => {
  return tasks.filter(task => {
    const statusMatch = tab.statusFilter.includes(task.status);
    const priorityMatch = tab.priorityFilter.includes(task.priority);
    return statusMatch && priorityMatch;
  });
};

// Sort tasks based on criteria
export const sortTasks = (tasks: Task[], sortBy?: string, sortOrder?: string): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'priority') {
      const priorityMap = { Low: 0, Medium: 1, High: 2 };
      comparison = priorityMap[a.priority as keyof typeof priorityMap] - 
                  priorityMap[b.priority as keyof typeof priorityMap];
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      comparison = (a[sortBy as keyof Task] as number) - (b[sortBy as keyof Task] as number);
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Format date for display
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};