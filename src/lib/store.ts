import { create } from "zustand"
import type { Task, Tab, TaskStatus } from "./types"
import { generateId } from "./utils"

interface AppState {
  // Data
  tasks: Task[]
  themes: Theme[]
  predefinedTabs: Tab[]
  customTabs: Tab[]

  // UI State
  activeTabId: string
  activeTaskId: string | null
  isTaskModalOpen: boolean
  isTabModalOpen: boolean

  // Computed
  activeTab: Tab

  // Actions
  initializeStore: () => void
  setActiveTab: (tabId: string) => void
  setTaskModalOpen: (isOpen: boolean) => void
  setTabModalOpen: (isOpen: boolean) => void
  setActiveTask: (taskId: string | null) => void

  // Task CRUD
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completedAt">) => void
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => void
  deleteTask: (taskId: string) => void

  // Theme CRUD
  addTheme: (theme: Omit<Theme, "id">) => void
  updateTheme: (themeId: string, updates: Partial<Omit<Theme, "id">>) => void
  deleteTheme: (themeId: string) => void

  // Tab CRUD
  addTab: (tab: Omit<Tab, "id">) => void
  updateTab: (tabId: string, updates: Partial<Omit<Tab, "id">>) => void
  deleteTab: (tabId: string) => void

  // Save state to localStorage whenever it changes
  saveState: () => void
}

// Define predefined tabs
const defaultPredefinedTabs: Tab[] = [
  {
    id: "all-issues",
    name: "All issues",
    statusFilter: ["Pending", "In Progress", "Completed", "Backlog"],
    priorityFilter: ["Low", "Medium", "High"],
    isCustom: false,
    sortBy: "updatedAt",
    sortOrder: "desc",
  },
  {
    id: "active",
    name: "Active",
    statusFilter: ["Pending", "In Progress"],
    priorityFilter: ["Low", "Medium", "High"],
    isCustom: false,
    sortBy: "updatedAt",
    sortOrder: "desc",
  },
  {
    id: "backlog",
    name: "Backlog",
    statusFilter: ["Backlog"],
    priorityFilter: ["Low", "Medium", "High"],
    isCustom: false,
    sortBy: "priority",
    sortOrder: "desc",
  },
]

const defaultThemes: Theme[] = [
  {
    id: "default",
    name: "Default",
    isDark: false,
    colors: {
      background: "#ffffff",
      text: "#1a1a1a",
      primary: "#3b82f6",
      secondary: "#6b7280",
      accent: "#f97316",
    },
  },
]

// Sample tasks for initial state
const sampleTasks: Task[] = [
  {
    id: "SAL-1",
    title: "Welcome to Linear 👋",
    description: "Get started with Linear by exploring the interface and creating your first task.",
    priority: "Medium",
    status: "Pending",
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    completedAt: null,
    themeId: "default",
  },
  {
    id: "SAL-2",
    title: "Connect to Slack",
    description: "Integrate with Slack to receive notifications and updates.",
    priority: "Low",
    status: "Pending",
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
    completedAt: null,
    themeId: "default",
  },
  {
    id: "SAL-3",
    title: "Connect GitHub or GitLab",
    description: "Link your repositories to track issues and pull requests.",
    priority: "Medium",
    status: "Pending",
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    completedAt: null,
    themeId: "default",
  },
  {
    id: "SAL-4",
    title: "Customize settings",
    description: "Adjust your workspace settings to match your workflow.",
    priority: "Low",
    status: "Pending",
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    completedAt: null,
    themeId: "default",
  },
  {
    id: "SAL-5",
    title: "Use Cycles to focus work over n-weeks",
    description: "Plan and track work in time-boxed cycles.",
    priority: "High",
    status: "Pending",
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    completedAt: null,
    themeId: "default",
  },
]

interface Theme {
  id: string
  name: string
  isDark: boolean
  colors: {
    background: string
    text: string
    primary: string
    secondary: string
    accent: string
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  tasks: [],
  themes: defaultThemes,
  predefinedTabs: defaultPredefinedTabs,
  customTabs: [],
  activeTabId: "all-issues",
  activeTaskId: null,
  isTaskModalOpen: false,
  isTabModalOpen: false,

  // Computed properties
  get activeTab() {
    const { activeTabId, predefinedTabs, customTabs } = get()
    return [...predefinedTabs, ...customTabs].find((tab) => tab.id === activeTabId) || predefinedTabs[0]
  },

  // Initialize store from localStorage or with defaults
  initializeStore: () => {
    try {
      const storedState = localStorage.getItem("linear-clone-state")
      if (storedState) {
        const { tasks, customTabs, activeTabId, themes } = JSON.parse(storedState)
        set({
          tasks: tasks || sampleTasks,
          customTabs: customTabs || [],
          activeTabId: activeTabId || "all-issues",
          themes: themes || defaultThemes,
        })
      } else {
        set({ tasks: sampleTasks, themes: defaultThemes })
      }
    } catch (error) {
      console.error("Failed to initialize store from localStorage:", error)
      set({ tasks: sampleTasks, themes: defaultThemes })
    }
  },

  // Save state to localStorage whenever it changes
  saveState: () => {
    try {
      const { tasks, customTabs, activeTabId, themes } = get()
      localStorage.setItem("linear-clone-state", JSON.stringify({ tasks, customTabs, activeTabId, themes }))
    } catch (error) {
      console.error("Failed to save state to localStorage:", error)
    }
  },

  // UI Actions
  setActiveTab: (tabId) => {
    set({ activeTabId: tabId })
    get().saveState()
  },

  setTaskModalOpen: (isOpen) => {
    set({ isTaskModalOpen: isOpen })
    if (!isOpen) {
      set({ activeTaskId: null })
    }
  },

  setTabModalOpen: (isOpen) => {
    set({ isTabModalOpen: isOpen })
  },

  setActiveTask: (taskId) => {
    set({ activeTaskId: taskId })
    if (taskId) {
      set({ isTaskModalOpen: true })
    }
  },

  // Task CRUD
  addTask: (taskData) => {
    const newTask: Task = {
      id: `SAL-${get().tasks.length + 1}`,
      ...taskData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      completedAt: null,
      themeId: "default",
    }

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }))

    get().saveState()
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: Date.now(),
              completedAt:
                updates.status === "Completed"
                  ? task.completedAt || Date.now()
                  : updates.status && updates.status !== "Completed"
                    ? null
                    : task.completedAt,
            }
          : task,
      ),
    }))

    get().saveState()
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      activeTaskId: state.activeTaskId === taskId ? null : state.activeTaskId,
      isTaskModalOpen: state.activeTaskId === taskId ? false : state.isTaskModalOpen,
    }))

    get().saveState()
  },

  // Theme CRUD
  addTheme: (themeData) => {
    const newTheme: Theme = {
      id: generateId(),
      ...themeData,
    }

    set((state) => ({
      themes: [...state.themes, newTheme],
    }))

    get().saveState()
  },

  updateTheme: (themeId, updates) => {
    set((state) => ({
      themes: state.themes.map((theme) => (theme.id === themeId ? { ...theme, ...updates } : theme)),
    }))

    get().saveState()
  },

  deleteTheme: (themeId) => {
    set((state) => ({
      themes: state.themes.filter((theme) => theme.id !== themeId),
    }))

    get().saveState()
  },

  // Tab CRUD
  addTab: (tabData) => {
    const newTab: Tab = {
      id: generateId(),
      ...tabData,
      isCustom: true,
    }

    set((state) => ({
      customTabs: [...state.customTabs, newTab],
      activeTabId: newTab.id,
    }))

    get().saveState()
  },

  updateTab: (tabId, updates) => {
    set((state) => ({
      customTabs: state.customTabs.map((tab) => (tab.id === tabId ? { ...tab, ...updates } : tab)),
    }))

    get().saveState()
  },

  deleteTab: (tabId) => {
    set((state) => {
      // Don't allow deleting if it's the active tab and the only tab
      if (state.activeTabId === tabId && state.customTabs.length === 1 && state.predefinedTabs.length === 0) {
        return state
      }

      // Set active tab to first predefined tab if deleting the active tab
      const newState: Partial<AppState> = {
        customTabs: state.customTabs.filter((tab) => tab.id !== tabId),
      }

      if (state.activeTabId === tabId) {
        newState.activeTabId = state.predefinedTabs[0].id
      }

      return newState as AppState
    })

    get().saveState()
  },
}))

export const useStore = useAppStore
export type { TaskStatus, Task }

