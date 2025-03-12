import { useAppStore } from "@/lib/store"
import { LayoutGrid, Bell, Plus, Search } from "lucide-react"

export function TopNavigation() {
  const { predefinedTabs, customTabs, activeTabId, setActiveTab, setTabModalOpen } = useAppStore()

  const allTabs = [...predefinedTabs, ...customTabs]

  return (
    <div className="border-b border-zinc-800">
      <div className="flex items-center h-12">
        {/* Left side tabs */}
        <div className="flex h-full pl-4">
          {predefinedTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 h-full flex items-center ${
                activeTabId === tab.id ? "border-b-2 border-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}

          {customTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 h-full flex items-center ${
                activeTabId === tab.id ? "border-b-2 border-white font-medium" : "text-zinc-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}

          <button
            className="px-4 h-full flex items-center text-zinc-400 hover:text-white"
            onClick={() => setTabModalOpen(true)}
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        {/* Right side icons */}
        <div className="ml-auto flex items-center h-full pr-4">
          <button className="px-4 h-full flex items-center text-zinc-400 hover:text-white">
            <Search size={16} />
          </button>
          <button className="px-4 h-full flex items-center text-zinc-400 hover:text-white">
            <Bell size={16} />
          </button>
          <button className="px-4 h-full flex items-center text-zinc-400 hover:text-white">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

