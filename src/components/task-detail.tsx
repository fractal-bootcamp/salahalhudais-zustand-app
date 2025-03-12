"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Task, type TaskStatus, useStore } from "@/lib/store"
import { X } from "lucide-react"

interface TaskDetailProps {
  task: Task
  onClose: () => void
}

export function TaskDetail({ task, onClose }: TaskDetailProps) {
  const { updateTask, themes } = useStore()
  const theme = themes.find((t) => t.id === task.themeId) || themes[0]

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Task Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1">Title</h4>
          <p className="text-base">{task.title}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Description</h4>
          <p className="text-sm">{task.description}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Status</h4>
          <Select value={task.status} onValueChange={(value) => updateTask(task.id, { status: value as TaskStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Theme</h4>
          <Select value={task.themeId} onValueChange={(value) => updateTask(task.id, { themeId: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Theme Preview</h4>
          <div
            className="p-3 rounded-md"
            style={{
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.primary}`,
            }}
          >
            <div className="flex gap-2 mb-2">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
            </div>
            <div className="text-xs">
              <span style={{ color: theme.colors.primary }}>Primary</span> /
              <span style={{ color: theme.colors.secondary }}> Secondary</span> /
              <span style={{ color: theme.colors.accent }}> Accent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

