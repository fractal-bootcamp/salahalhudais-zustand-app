import { useEffect } from 'react';
import { useAppStore } from './store';
import { filterTasks, sortTasks } from './utils';
import { CircleIcon, PlusIcon, FilterIcon, BellIcon, LayoutGridIcon } from 'lucide-react';
import { Task } from './types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Placeholder components - you'll implement these later
interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-1">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No tasks found. Create a new task to get started.
        </div>
      ) : (
        tasks.map(task => (
          <div 
            key={task.id}
            className="flex items-center py-3 px-2 hover:bg-gray-800 cursor-pointer rounded-sm"
            onClick={() => {
              useAppStore.getState().setActiveTask(task);
              useAppStore.getState().setTaskModalOpen(true);
            }}
          >
            <div className="flex items-center w-8">
              <CircleIcon size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 ml-2">{task.title}</div>
            <div className="text-sm text-gray-400 mr-4">{task.priority}</div>
            <div className="text-sm text-gray-400">{new Date(task.updatedAt).toLocaleDateString()}</div>
          </div>
        ))
      )}
    </div>
  );
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>
        {/* Form will go here */}
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-700 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface TabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TabModal: React.FC<TabModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add View</h2>
        {/* Form will go here */}
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 bg-gray-700 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const {
    tasks,
    activeTab,
    predefinedTabs,
    customTabs,
    setActiveTab,
    isTaskModalOpen,
    isTabModalOpen,
    setTaskModalOpen,
    setTabModalOpen,
    activeTask
  } = useAppStore();

  // Get filtered and sorted tasks based on active tab
  const filteredTasks = filterTasks(tasks, activeTab);
  const sortedTasks = sortTasks(
    filteredTasks, 
    activeTab.sortBy, 
    activeTab.sortOrder
  );

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-800">
        <div className="flex items-center h-12">
          {/* Left side tabs */}
          <div className="flex h-full pl-4">
            <Tabs defaultValue={activeTab.id} onValueChange={(value) => setActiveTab(value)}>
              <TabsList>
                {predefinedTabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <button
              className="px-4 h-full flex items-center text-gray-400 hover:text-white"
              onClick={() => setTabModalOpen(true)}
            >
              <LayoutGridIcon size={16} />
            </button>
          </div>
          
          {/* Right side icons */}
          <div className="ml-auto flex items-center h-full pr-4">
            <button className="px-4 h-full flex items-center text-gray-400 hover:text-white">
              <BellIcon size={16} />
            </button>
            <button className="px-4 h-full flex items-center text-gray-400 hover:text-white">
              <LayoutGridIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-gray-800 h-12 flex items-center justify-between">
        <div className="flex items-center pl-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem checked={true}>
                Show completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={true}>
                Show backlog
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center pr-4">
          <button className="flex items-center text-gray-400 hover:text-white">
            <span>Display</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Task Category Header */}
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-800">
          <div className="flex items-center">
            <CircleIcon size={18} className="mr-2 text-gray-400" />
            <h2 className="text-lg font-medium">Todo</h2>
            <span className="ml-2 text-gray-400 text-sm">{sortedTasks.length}</span>
          </div>
          <button
            className="p-1 rounded-full hover:bg-gray-800"
            onClick={() => setTaskModalOpen(true)}
          >
            <PlusIcon size={18} />
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-auto">
          {sortedTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No tasks found. Create a new task to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTasks.map(task => (
                  <TableRow 
                    key={task.id}
                    onClick={() => {
                      useAppStore.getState().setActiveTask(task);
                      useAppStore.getState().setTaskModalOpen(true);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell><CircleIcon size={16} className="text-gray-400" /></TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell className="text-right">{new Date(task.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{activeTask ? 'Edit Task' : 'Create Task'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              placeholder="Task title" 
              defaultValue={activeTask?.title || ''} 
            />
            <Textarea 
              placeholder="Description" 
              defaultValue={activeTask?.description || ''} 
            />
            <Select defaultValue={activeTask?.priority || 'Medium'}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue={activeTask?.status || 'Pending'}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Backlog">Backlog</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TabModal isOpen={isTabModalOpen} onClose={() => setTabModalOpen(false)} />
    </div>
  );
}

export default App;