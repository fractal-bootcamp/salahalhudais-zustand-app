"use client"

import { useAppStore } from "@/lib/store"
import { filterTasks, sortTasks, formatDate } from "@/lib/utils"
import { Circle } from "lucide-react"

export function TaskList() {
  const { tasks, activeTab, setActiveTask } = useAppStore()

  // Get filtered and sorted tasks based on active tab
  const filteredTasks = filterTasks(tasks, activeTab)
  const sortedTasks = sortTasks(filteredTasks, activeTab.sortBy, activeTab.sortOrder)

  if (sortedTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400 p-8">
        No tasks found. Create a new task to get started.
      </div>
    )
  }

  return (
    <div className="px-4">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center py-3 border-b border-zinc-800 hover:bg-zinc-900/30 cursor-pointer rounded-sm group"
          onClick={() => setActiveTask(task.id)}
        >
          <div className="flex items-center w-8">
            <Circle size={16} className="text-zinc-400" />
          </div>
          <div className="w-24 text-xs text-zinc-500 font-mono">{task.id}</div>
          <div className="flex-1 font-medium">{task.title}</div>
          <div className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-400 mr-4 opacity-0 group-hover:opacity-100">
            {task.priority}
          </div>
          <div className="text-sm text-zinc-400 opacity-0 group-hover:opacity-100 w-20 text-right">
            {formatDate(task.updatedAt)}
          </div>
        </div>
      ))}
    </div>
  )
}

