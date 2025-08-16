import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { 
  Plus, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Lightbulb,
  Calendar,
  BarChart3
} from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import { useTheme } from '../contexts/ThemeContext';
import TaskCard from '../components/Tasks/TaskCard';
import HabitCard from '../components/Habits/HabitCard';
import QuickAddModal from '../components/Common/QuickAddModal';

const Dashboard = () => {
  const { 
    tasks, 
    habits, 
    selectedDate, 
    getTasksForDate, 
    getHabitsForDate, 
    getAISuggestions,
    addTask,
    addHabit 
  } = usePlanner();
  const { isDarkMode } = useTheme();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const todayTasks = getTasksForDate(selectedDate);
  const todayHabits = getHabitsForDate(selectedDate);
  
  const completedTasks = todayTasks.filter(task => task.status === 'completed');
  const pendingTasks = todayTasks.filter(task => task.status !== 'completed');
  const completedHabits = todayHabits.filter(habit => habit.isCompleted);

  // Get motivational quote
  const motivationalQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs"
  ];

  const [quote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    setAiSuggestions(getAISuggestions());
  }, [getAISuggestions]);

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const handleQuickAdd = (type, data) => {
    if (type === 'task') {
      addTask({ ...data, dueDate: selectedDate });
    } else if (type === 'habit') {
      addHabit(data);
    }
    setShowQuickAdd(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {getDateLabel(selectedDate)} • Let's make today productive
          </p>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setShowQuickAdd(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Quick Add
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pendingTasks.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Pending</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completedTasks.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{completedHabits.length}/{todayHabits.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Habits Done</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {habits.reduce((max, habit) => Math.max(max, habit.streak), 0)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Today's Tasks */}
        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Clock size={20} />
              Today's Tasks
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {pendingTasks.length} pending
            </span>
          </div>
          
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                <CheckCircle size={48} className="mb-4 opacity-50" />
                <p className="mb-4">No pending tasks for today!</p>
                <button 
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  onClick={() => setShowQuickAdd(true)}
                >
                  Add a task
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Today's Habits */}
        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Target size={20} />
              Today's Habits
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {completedHabits.length}/{todayHabits.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {todayHabits.length > 0 ? (
              todayHabits.slice(0, 5).map((habit) => (
                <HabitCard key={habit.id} habit={habit} compact />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
                <Target size={48} className="mb-4 opacity-50" />
                <p className="mb-4">No habits set up yet!</p>
                <button 
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  onClick={() => setShowQuickAdd(true)}
                >
                  Add a habit
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* AI Suggestions */}
      <motion.div 
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <Lightbulb size={20} className="inline mr-2" />
            AI Insights
          </h2>
        </div>
        
        <div className="space-y-4">
          {aiSuggestions.length > 0 ? (
            aiSuggestions.slice(0, 4).map((suggestion, index) => {
              const getBorderColor = (priority) => {
                switch (priority) {
                  case 'high': return 'border-red-500';
                  case 'medium': return 'border-orange-500';
                  case 'low': return 'border-blue-500';
                  default: return 'border-gray-500';
                }
              };

              const getBgColor = (priority) => {
                switch (priority) {
                  case 'high': return 'bg-red-50 dark:bg-red-900/20';
                  case 'medium': return 'bg-orange-50 dark:bg-orange-900/20';
                  case 'low': return 'bg-blue-50 dark:bg-blue-900/20';
                  default: return 'bg-gray-50 dark:bg-gray-700';
                }
              };

              const getIconColor = (priority) => {
                switch (priority) {
                  case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
                  case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
                  case 'low': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
                  default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
                }
              };

              return (
                <motion.div 
                  key={index} 
                  className={`flex items-start gap-4 p-4 ${getBgColor(suggestion.priority)} rounded-lg border-l-4 ${getBorderColor(suggestion.priority)} hover:shadow-md transition-shadow duration-200`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-10 h-10 ${getIconColor(suggestion.priority)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{suggestion.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      {suggestion.message}
                    </p>
                    {suggestion.tasks && suggestion.tasks.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Clock size={12} />
                        <span>{suggestion.tasks.length} related task{suggestion.tasks.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                  {suggestion.priority === 'high' && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Urgent
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">All Good!</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">Great job! You're on track with your goals.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div 
        className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb size={24} />
          </div>
          <blockquote className="text-lg italic leading-relaxed opacity-95">
            "{quote}"
          </blockquote>
        </div>
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={handleQuickAdd}
      />
    </div>
  );
};

export default Dashboard; 