import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Tab } from './types';

// Helper function to generate UUIDv4
const generateId = (): string => {
  return crypto.randomUUID();
};

// Define predefined tabs
const predefinedTabs: Tab[] = [
  {
    id: 'all-issues',
    name: 'All issues',
    statusFilter: ['Pending', 'In Progress', 'Completed', 'Backlog'],
    priorityFilter: ['Low', 'Medium', 'High'],
    isCustom: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  },
  {
    id: 'active',
    name: 'Active',
    statusFilter: ['Pending', 'In Progress'],
    priorityFilter: ['Low', 'Medium', 'High'],
    isCustom: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  },
  {
    id: 'backlog',
    name: 'Backlog',
    statusFilter: ['Backlog'],
    priorityFilter: ['Low', 'Medium', 'High'],
    isCustom: false,
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  }
];

// Define store interface
interface AppState {
  // Task state
  tasks: Task[];
  activeTask: Task | null;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>) => void;
  editTask: (taskId: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>>) => void;
  deleteTask: (taskId: string) => void;
  setActiveTask: (task: Task | null) => void;
  
  // Tab state
  predefinedTabs: Tab[];
  customTabs: Tab[];
  activeTab: Tab;
  addCustomTab: (tab: Omit<Tab, 'id' | 'isCustom'>) => void;
  editCustomTab: (tabId: string, tabData: Partial<Omit<Tab, 'id' | 'isCustom'>>) => void;
  deleteCustomTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  
  // UI state
  isTaskModalOpen: boolean;
  isTabModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  setTabModalOpen: (isOpen: boolean) => void;
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Task state
      tasks: [],
      activeTask: null,
      
      addTask: (taskData) => {
        const now = Date.now();
        const newTask: Task = {
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          completedAt: taskData.status === 'Completed' ? now : null,
          ...taskData
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },
      
      editTask: (taskId, taskData) => {
        set((state) => {
          const now = Date.now();
          const updatedTasks = state.tasks.map(task => {
            if (task.id === taskId) {
              let completedAt = task.completedAt;
              if (taskData.status === 'Completed' && task.status !== 'Completed') {
                completedAt = now;
              } else if (taskData.status && taskData.status !== 'Completed' && task.status === 'Completed') {
                completedAt = null;
              }
              
              return {
                ...task,
                ...taskData,
                updatedAt: now,
                completedAt
              };
            }
            return task;
          });
          
          // Update activeTask if it's the one being edited
          let activeTask = state.activeTask;
          if (activeTask && activeTask.id === taskId) {
            activeTask = updatedTasks.find(task => task.id === taskId) || null;
          }
          
          return {
            tasks: updatedTasks,
            activeTask
          };
        });
      },
      
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
          activeTask: state.activeTask?.id === taskId ? null : state.activeTask
        }));
      },
      
      setActiveTask: (task) => {
        set({ activeTask: task });
      },
      
      // Tab state
      predefinedTabs,
      customTabs: [],
      activeTab: predefinedTabs[0], // Default to All issues
      
      addCustomTab: (tab) => {
        const newTab: Tab = {
          id: generateId(),
          isCustom: true,
          ...tab
        };
        
        set((state) => ({
          customTabs: [...state.customTabs, newTab]
        }));
      },
      
      editCustomTab: (tabId, tabData) => {
        set((state) => {
          const updatedTabs = state.customTabs.map(tab => {
            if (tab.id === tabId) {
              return { ...tab, ...tabData };
            }
            return tab;
          });
          
          // Update activeTab if it's the one being edited
          let activeTab = state.activeTab;
          if (activeTab.id === tabId) {
            activeTab = updatedTabs.find(tab => tab.id === tabId) || activeTab;
          }
          
          return {
            customTabs: updatedTabs,
            activeTab
          };
        });
      },
      
      deleteCustomTab: (tabId) => {
        set((state) => {
          const updatedTabs = state.customTabs.filter(tab => tab.id !== tabId);
          
          // If the active tab is being deleted, switch to All issues
          let activeTab = state.activeTab;
          if (activeTab.id === tabId) {
            activeTab = state.predefinedTabs[0];
          }
          
          return {
            customTabs: updatedTabs,
            activeTab
          };
        });
      },
      
      setActiveTab: (tabId) => {
        set((state) => {
          const allTabs = [...state.predefinedTabs, ...state.customTabs];
          const tab = allTabs.find(t => t.id === tabId);
          return {
            activeTab: tab || state.predefinedTabs[0]
          };
        });
      },
      
      // UI state
      isTaskModalOpen: false,
      isTabModalOpen: false,
      
      setTaskModalOpen: (isOpen) => {
        set({ isTaskModalOpen: isOpen });
      },
      
      setTabModalOpen: (isOpen) => {
        set({ isTabModalOpen: isOpen });
      }
    }),
    {
      name: 'linear-app-storage', // localStorage key
      partialize: (state) => ({
        tasks: state.tasks,
        customTabs: state.customTabs,
        activeTab: state.activeTab.id // Store only the ID to avoid circular references
      })
    }
  )
);