"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import type { TaskStatus, TaskPriority } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TabModalProps {
  isOpen: boolean
  tabId?: string
}

export function TabModal({ isOpen, tabId }: TabModalProps) {
  const { customTabs, addTab, updateTab, deleteTab, setTabModalOpen } = useAppStore()

  const existingTab = tabId ? customTabs.find((t) => t.id === tabId) : null
  const isEditing = !!existingTab

  const [name, setName] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([])
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority[]>([])
  const [sortBy, setSortBy] = useState<string>("updatedAt")
  const [sortOrder, setSortOrder] = useState<string>("desc")

  // Reset form when modal opens/closes or tab changes
  useEffect(() => {
    if (isOpen && existingTab) {
      setName(existingTab.name)
      setStatusFilter(existingTab.statusFilter)
      setPriorityFilter(existingTab.priorityFilter)
      setSortBy(existingTab.sortBy || "updatedAt")
      setSortOrder(existingTab.sortOrder || "desc")
    } else if (isOpen) {
      // Default values for new tab
      setName("")
      setStatusFilter(["Pending", "In Progress", "Completed", "Backlog"])
      setPriorityFilter(["Low", "Medium", "High"])
      setSortBy("updatedAt")
      setSortOrder("desc")
    }
  }, [isOpen, existingTab])

  const handleClose = () => {
    setTabModalOpen(false)
  }

  const handleSave = () => {
    if (!name.trim()) return

    if (isEditing && existingTab) {
      updateTab(existingTab.id, {
        name,
        statusFilter,
        priorityFilter,
        sortBy,
        sortOrder,
        isCustom: true,
      })
    } else {
      addTab({
        name,
        statusFilter,
        priorityFilter,
        sortBy,
        sortOrder,
        isCustom: true,
      })
    }

    handleClose()
  }

  const handleDelete = () => {
    if (isEditing && existingTab) {
      deleteTab(existingTab.id)
    }
    handleClose()
  }

  const toggleStatus = (status: TaskStatus) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter((s) => s !== status))
    } else {
      setStatusFilter([...statusFilter, status])
    }
  }

  const togglePriority = (priority: TaskPriority) => {
    if (priorityFilter.includes(priority)) {
      setPriorityFilter(priorityFilter.filter((p) => p !== priority))
    } else {
      setPriorityFilter([...priorityFilter, priority])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setTabModalOpen}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit View" : "Add View"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">View Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom View"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid gap-2">
            <Label>Status Filter</Label>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-pending"
                  checked={statusFilter.includes("Pending")}
                  onCheckedChange={() => toggleStatus("Pending")}
                />
                <Label htmlFor="status-pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-in-progress"
                  checked={statusFilter.includes("In Progress")}
                  onCheckedChange={() => toggleStatus("In Progress")}
                />
                <Label htmlFor="status-in-progress">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-completed"
                  checked={statusFilter.includes("Completed")}
                  onCheckedChange={() => toggleStatus("Completed")}
                />
                <Label htmlFor="status-completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-backlog"
                  checked={statusFilter.includes("Backlog")}
                  onCheckedChange={() => toggleStatus("Backlog")}
                />
                <Label htmlFor="status-backlog">Backlog</Label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Priority Filter</Label>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-low"
                  checked={priorityFilter.includes("Low")}
                  onCheckedChange={() => togglePriority("Low")}
                />
                <Label htmlFor="priority-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-medium"
                  checked={priorityFilter.includes("Medium")}
                  onCheckedChange={() => togglePriority("Medium")}
                />
                <Label htmlFor="priority-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="priority-high"
                  checked={priorityFilter.includes("High")}
                  onCheckedChange={() => togglePriority("High")}
                />
                <Label htmlFor="priority-high">High</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sort-order">Sort Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sort-order" className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
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

