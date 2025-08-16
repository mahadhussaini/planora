import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  MoreVertical, 
  Trash2,
  Edit,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { usePlanner } from '../../contexts/PlannerContext';

const HabitCard = ({ habit, compact = false, showActions = true }) => {
  const { completeHabit, deleteHabit, updateHabit } = usePlanner();
  const [showMenu, setShowMenu] = useState(false);

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Daily';
    }
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '📊';
      default: return '📅';
    }
  };

  const handleComplete = () => {
    if (!habit.isCompleted) {
      completeHabit(habit.id);
    }
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    setShowMenu(false);
  };

  const handleFrequencyChange = (newFrequency) => {
    updateHabit(habit.id, { frequency: newFrequency });
    setShowMenu(false);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
        habit.isCompleted ? 'opacity-80 bg-gray-50 dark:bg-gray-700' : ''
      } ${compact ? 'p-3' : ''}`}
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
              habit.isCompleted 
                ? 'text-green-500' 
                : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
            onClick={handleComplete}
            disabled={habit.isCompleted}
            aria-label={habit.isCompleted ? 'Already completed' : 'Mark as complete'}
          >
            {habit.isCompleted ? (
              <CheckCircle size={16} />
            ) : (
              <Circle size={16} />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm leading-tight ${
              habit.isCompleted 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {habit.title}
            </h3>
            {!compact && habit.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              <TrendingUp size={12} />
              <span>{habit.streak}</span>
            </div>
            
            <div className="relative">
              <button
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Habit options"
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
                      Frequency
                    </div>
                    {['daily', 'weekly', 'monthly'].map((frequency) => (
                      <button
                        key={frequency}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          habit.frequency === frequency ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleFrequencyChange(frequency)}
                      >
                        <span className="text-base">{getFrequencyIcon(frequency)}</span>
                        {getFrequencyLabel(frequency)}
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
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            <Calendar size={12} />
            <span>{getFrequencyLabel(habit.frequency)}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Streak</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{habit.streak} days</span>
          </div>
          
          {habit.longestStreak > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Best</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{habit.longestStreak} days</span>
            </div>
          )}
        </div>
      )}

      {compact && (
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {getFrequencyIcon(habit.frequency)} {getFrequencyLabel(habit.frequency)}
          </span>
          <span className="text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white px-2 py-1 rounded">
            🔥 {habit.streak}
          </span>
        </div>
      )}

      {habit.isCompleted && (
        <motion.div
          className="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm rounded-xl backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <CheckCircle size={20} />
          <span>Completed!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(HabitCard); 