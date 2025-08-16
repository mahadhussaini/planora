import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { 
  CheckCircle, 
  Circle, 
  MoreVertical, 
  Calendar, 
  Tag, 
  Trash2,
  Edit,
  Flag
} from 'lucide-react';
import { usePlanner } from '../../contexts/PlannerContext';

const TaskCard = ({ task, compact = false, showActions = true }) => {
  const { completeTask, deleteTask, updateTask } = usePlanner();
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'None';
    }
  };

  const getDateLabel = (date) => {
    if (!date) return null;
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    if (isYesterday(taskDate)) return 'Yesterday';
    return format(taskDate, 'MMM d');
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowMenu(false);
  };

  const handlePriorityChange = (newPriority) => {
    updateTask(task.id, { priority: newPriority });
    setShowMenu(false);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
        task.status === 'completed' ? 'opacity-70 bg-gray-50 dark:bg-gray-700' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${compact ? 'p-3' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            className={`p-1 rounded transition-colors ${
              task.status === 'completed' 
                ? 'text-green-500' 
                : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
            onClick={handleComplete}
            aria-label={task.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.status === 'completed' ? (
              <CheckCircle size={16} />
            ) : (
              <Circle size={16} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-tight ${
              task.status === 'completed' 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {task.title}
            </h3>
            {!compact && task.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              <Flag size={10} />
            </div>
            
            <div className="relative">
              <button
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Task options"
              >
                <MoreVertical size={16} />
              </button>
              
              {showMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48 z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Priority
                    </div>
                    {['low', 'medium', 'high'].map((priority) => (
                      <button
                        key={priority}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          task.priority === priority ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handlePriorityChange(priority)}
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getPriorityColor(priority) }}
                        />
                        {getPriorityLabel(priority)}
                      </button>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="flex items-center gap-4 mt-3 flex-wrap">
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <Calendar size={12} />
              <span>{getDateLabel(task.dueDate)}</span>
            </div>
          )}
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Tag size={12} />
              <div className="flex items-center gap-1 flex-wrap">
                {task.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs">
                    +{task.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {compact && task.dueDate && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={10} />
          <span>{getDateLabel(task.dueDate)}</span>
        </div>
      )}
    </motion.div>
  );
};

export default memo(TaskCard); 