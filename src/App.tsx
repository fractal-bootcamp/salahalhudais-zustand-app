"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { TaskList } from "@/components/task-list"
import { TaskModal } from "@/components/task-modal"
import { TabModal } from "@/components/tab-modal"
import { TopNavigation } from "@/components/top-navigation"
import { FilterBar } from "@/components/filter-bar"
import { TaskHeader } from "@/components/task-header"

export default function App() {
  const { initializeStore, tasks, activeTab, isTaskModalOpen, isTabModalOpen, activeTaskId } = useAppStore()

  // Initialize store on component mount
  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  return (
    <div className="min-h-screen min-w-screen w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Filter Bar */}
      <FilterBar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Task Category Header */}
        <TaskHeader />

        {/* Task List */}
        <div className="flex-1 overflow-auto">
          <TaskList />
        </div>
      </div>

      {/* Modals */}
      <TaskModal isOpen={isTaskModalOpen} taskId={activeTaskId} />

      <TabModal isOpen={isTabModalOpen} />
    </div>
  )
}

