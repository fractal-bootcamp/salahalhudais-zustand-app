import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import type { TaskStatus, TaskPriority } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskModalProps {
  isOpen: boolean
  taskId: string | null
}

export function TaskModal({ isOpen, taskId }: TaskModalProps) {
  const { tasks, addTask, updateTask, deleteTask, setTaskModalOpen } = useAppStore()

  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null
  const isEditing = !!existingTask

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("Pending")
  const [priority, setPriority] = useState<TaskPriority>("Medium")

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen && existingTask) {
      setTitle(existingTask.title)
      setDescription(existingTask.description)
      setStatus(existingTask.status)
      setPriority(existingTask.priority)
    } else if (isOpen) {
      // Default values for new task
      setTitle("")
      setDescription("")
      setStatus("Pending")
      setPriority("Medium")
    }
  }, [isOpen, existingTask])

  const handleClose = () => {
    setTaskModalOpen(false)
  }

  const handleSave = () => {
    if (!title.trim()) return

    if (isEditing && existingTask) {
      updateTask(existingTask.id, {
        title,
        description,
        status,
        priority,
      })
    } else {
      addTask({
        title,
        description,
        status,
        priority,
      })
    }

    handleClose()
  }

  const handleDelete = () => {
    if (isEditing && existingTask) {
      deleteTask(existingTask.id)
    }
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setTaskModalOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Task" : "Add Task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={4}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger id="status" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Backlog">Backlog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger id="priority" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {isEditing && (
            <Button variant="destructive" onClick={handleDelete} className="bg-red-900 hover:bg-red-800">
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

