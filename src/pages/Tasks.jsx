import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  List,
  Grid3X3
} from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import TaskCard from '../components/Tasks/TaskCard';
import TaskFormModal from '../components/Tasks/TaskFormModal';
import VirtualizedList from '../components/Common/VirtualizedList';

const TaskColumn = ({ id, title, tasks, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[500px] flex flex-col transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            showActions={true}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400 flex-1">
            <div className="mb-4 opacity-50">
              {id === 'todo' && <Clock size={24} />}
              {id === 'in-progress' && <AlertCircle size={24} />}
              {id === 'completed' && <CheckCircle size={24} />}
            </div>
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Tasks = () => {
  const { tasks, moveTask, addTask, updateTask, deleteTask } = usePlanner();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = useMemo(() => {
    const filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesPriority;
    });

    return {
      todo: filteredTasks.filter(task => task.status === 'todo'),
      'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
      completed: filteredTasks.filter(task => task.status === 'completed'),
    };
  }, [tasks, searchTerm, filterPriority]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const activeTask = tasks.find(task => task.id === active.id);
      const newStatus = over.id;
      
      if (activeTask && ['todo', 'in-progress', 'completed'].includes(newStatus)) {
        moveTask(activeTask.id, newStatus);
      }
    }
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleAddTask = (taskData) => {
    addTask(taskData);
    setShowTaskForm(false);
  };

  const handleUpdateTask = (taskData) => {
    updateTask(editingTask.id, taskData);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
    if (editingTask?.id === taskId) {
      setEditingTask(null);
      setShowTaskForm(false);
    }
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage your tasks with our Kanban board
          </p>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setShowTaskForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Task
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* View Toggle */}
          <div className="flex bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Grid3X3 size={16} />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <List size={16} />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content Views */}
      <div className="min-h-[600px]">
        {viewMode === 'kanban' ? (
          /* Kanban Board */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SortableContext
                items={['todo', 'in-progress', 'completed']}
                strategy={verticalListSortingStrategy}
              >
                <TaskColumn
                  id="todo"
                  title="To Do"
                  tasks={columns.todo}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  id="in-progress"
                  title="In Progress"
                  tasks={columns['in-progress']}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  id="completed"
                  title="Completed"
                  tasks={columns.completed}
                  onTaskClick={handleTaskClick}
                />
              </SortableContext>
            </div>

            <DragOverlay>
              {activeTask ? (
                <div className="transform rotate-2 shadow-2xl">
                  <TaskCard task={activeTask} showActions={false} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          /* List View with Virtual Scrolling */
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                All Tasks ({Object.values(columns).flat().length})
              </h3>
            </div>
            
            <VirtualizedList
              items={Object.values(columns).flat().sort((a, b) => {
                // Sort by priority, then by due date
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                if (a.dueDate && b.dueDate) {
                  return new Date(a.dueDate) - new Date(b.dueDate);
                }
                return a.dueDate ? -1 : b.dueDate ? 1 : 0;
              })}
              itemHeight={120}
              containerHeight={600}
              renderItem={(task) => (
                <div className="px-4 py-2">
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                    showActions={true}
                    compact={false}
                  />
                </div>
              )}
              onItemClick={handleTaskClick}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        task={editingTask}
        onDelete={editingTask ? () => handleDeleteTask(editingTask.id) : null}
      />
    </div>
  );
};

export default Tasks; 