import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCard } from "@/components/task-card"
import { TaskDetail } from "@/components/task-detail"
import { useStore, type TaskStatus } from "@/lib/store"

export function TabTaskView() {
  const { tasks, activeTaskId, setActiveTaskId } = useStore()
  const [activeTab, setActiveTab] = useState<TaskStatus>("pending")

  const filteredTasks = tasks.filter((task) => task.status === activeTab)
  const activeTask = tasks.find((task) => task.id === activeTaskId)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TaskStatus)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tasks in this status</div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setActiveTaskId(task.id)}
                    isActive={task.id === activeTaskId}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-lg p-4">
        {activeTask ? (
          <TaskDetail task={activeTask} onClose={() => setActiveTaskId(null)} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">Select a task to view details</div>
        )}
      </div>
    </div>
  )
}

