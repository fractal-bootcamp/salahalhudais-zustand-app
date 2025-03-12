import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore, type TaskStatus } from "@/lib/store"

interface TaskFormProps {
  onComplete: () => void
  taskId?: string
}

export function TaskForm({ onComplete, taskId }: TaskFormProps) {
  const { tasks, themes, addTask, updateTask } = useStore()

  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null

  const [title, setTitle] = useState(existingTask?.title || "")
  const [description, setDescription] = useState(existingTask?.description || "")
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status || "pending")
  const [themeId, setThemeId] = useState(existingTask?.themeId || themes[0].id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    if (existingTask) {
      updateTask(existingTask.id, {
        title,
        description,
        status,
        themeId,
      })
    } else {
      addTask({
        title,
        description,
        status,
        themeId,
      })
    }

    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={themeId} onValueChange={setThemeId}>
          <SelectTrigger id="theme">
            <SelectValue placeholder="Select theme" />
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

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">{existingTask ? "Update" : "Create"} Task</Button>
      </div>
    </form>
  )
}

