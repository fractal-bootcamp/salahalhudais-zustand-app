import { useAppStore } from "@/lib/store"
import { filterTasks } from "@/lib/utils"
import { Circle, Plus } from "lucide-react"

export function TaskHeader() {
  const { tasks, activeTab, setTaskModalOpen, setActiveTask } = useAppStore()
  const filteredTasks = filterTasks(tasks, activeTab)

  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-zinc-800">
      <div className="flex items-center">
        <Circle size={18} className="mr-2 text-zinc-400" />
        <h2 className="text-lg font-medium">Todo</h2>
        <span className="ml-2 text-zinc-400 text-sm">{filteredTasks.length}</span>
      </div>
      <button
        className="p-1 rounded-full hover:bg-zinc-800"
        onClick={() => {
          setActiveTask(null)
          setTaskModalOpen(true)
        }}
      >
        <Plus size={18} />
      </button>
    </div>
  )
}

