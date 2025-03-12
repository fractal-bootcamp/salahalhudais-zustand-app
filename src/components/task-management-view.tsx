"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "@/components/task-form"
import { ThemeForm } from "@/components/theme-form"
import { TaskList } from "@/components/task-list"

export function TaskManagementView() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [createThemeOpen, setCreateThemeOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setCreateTaskOpen(true)}>Create Task</Button>
          <Button variant="outline" onClick={() => setCreateThemeOpen(true)}>
            Create Theme
          </Button>
        </div>
      </div>

      <TaskList />

      <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onComplete={() => setCreateTaskOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={createThemeOpen} onOpenChange={setCreateThemeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Theme</DialogTitle>
          </DialogHeader>
          <ThemeForm onComplete={() => setCreateThemeOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

