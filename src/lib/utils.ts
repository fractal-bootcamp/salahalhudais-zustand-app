import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Task, Tab } from "./types"

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9)
}

// Filter tasks based on tab filters
export const filterTasks = (tasks: Task[], tab: Tab): Task[] => {
  return tasks.filter((task) => tab.statusFilter.includes(task.status) && tab.priorityFilter.includes(task.priority))
}

// Sort tasks based on criteria
export const sortTasks = (
  tasks: Task[],
  sortBy: string | undefined = "updatedAt",
  sortOrder: string | undefined = "desc",
): Task[] => {
  return [...tasks].sort((a, b) => {
    let comparison = 0

    if (sortBy === "priority") {
      const priorityMap = { Low: 0, Medium: 1, High: 2 }
      comparison =
        priorityMap[a.priority as keyof typeof priorityMap] - priorityMap[b.priority as keyof typeof priorityMap]
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status)
    } else if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "completedAt") {
      // Handle null completedAt values
      if (sortBy === "completedAt") {
        if (a.completedAt === null && b.completedAt === null) comparison = 0
        else if (a.completedAt === null) comparison = 1
        else if (b.completedAt === null) comparison = -1
        else comparison = a.completedAt - b.completedAt
      } else {
        comparison = (a[sortBy as keyof Task] as number) - (b[sortBy as keyof Task] as number)
      }
    }

    return sortOrder === "desc" ? -comparison : comparison
  })
}

// Format date to display
export const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return ""

  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // If today, return time
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // If yesterday, return "Yesterday"
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  }

  // Otherwise return "Mar 12" format
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Get priority color
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "High":
      return "text-red-500"
    case "Medium":
      return "text-yellow-500"
    case "Low":
      return "text-blue-500"
    default:
      return "text-gray-400"
  }
}

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Completed":
      return "text-green-500"
    case "In Progress":
      return "text-purple-500"
    case "Pending":
      return "text-yellow-500"
    case "Backlog":
      return "text-gray-500"
    default:
      return "text-gray-400"
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

