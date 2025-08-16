import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { usePlanner } from '../contexts/PlannerContext';
import TaskCard from '../components/Tasks/TaskCard';
import HabitCard from '../components/Habits/HabitCard';
import QuickAddModal from '../components/Common/QuickAddModal';

const Calendar = () => {
  const { tasks, habits, selectedDate, setSelectedDate, getTasksForDate, getHabitsForDate, addTask, addHabit } = usePlanner();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState(null);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedDateTasks = useMemo(() => 
    getTasksForDate(selectedDate), [getTasksForDate, selectedDate]
  );

  const selectedDateHabits = useMemo(() => 
    getHabitsForDate(selectedDate), [getHabitsForDate, selectedDate]
  );

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleQuickAdd = (type, data) => {
    const targetDate = selectedDateForAdd || selectedDate;
    
    if (type === 'task') {
      const taskData = {
        ...data,
        dueDate: targetDate.toISOString()
      };
      addTask(taskData);
    } else if (type === 'habit') {
      const habitData = {
        ...data
      };
      addHabit(habitData);
    }
    
    setShowQuickAdd(false);
    setSelectedDateForAdd(null);
  };

  const handleAddToDate = (date) => {
    setSelectedDateForAdd(date);
    setShowQuickAdd(true);
  };

  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  const getHabitsForDay = (date) => {
    return habits.map(habit => ({
      ...habit,
      isCompleted: habit.completedDates.includes(format(date, 'yyyy-MM-dd')),
    }));
  };

  const getDayEvents = (date) => {
    const dayTasks = getTasksForDay(date);
    const dayHabits = getHabitsForDay(date);
    const completedHabits = dayHabits.filter(habit => habit.isCompleted);
    
    return {
      tasks: dayTasks.length,
      habits: dayHabits.length,
      completedHabits: completedHabits.length,
      hasEvents: dayTasks.length > 0 || dayHabits.length > 0
    };
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            Calendar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View your tasks and habits in a calendar layout
          </p>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setShowQuickAdd(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Event
        </motion.button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const events = getDayEvents(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            
            return (
              <motion.div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 relative group ${
                  !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900' : ''
                } ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    !isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : 
                    isCurrentDay ? 'text-primary-600 dark:text-primary-400' : 
                    'text-gray-900 dark:text-gray-100'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  
                  {events.hasEvents && (
                    <div className="flex gap-1">
                      {events.tasks > 0 && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title={`${events.tasks} tasks`} />
                      )}
                      {events.habits > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title={`${events.habits} habits`} />
                      )}
                    </div>
                  )}
                </div>

                {/* Event Indicators */}
                {events.hasEvents && (
                  <div className="space-y-1">
                    {events.tasks > 0 && (
                      <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                        <Clock size={10} />
                        <span>{events.tasks} task{events.tasks > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    {events.habits > 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <Target size={10} />
                        <span>{events.completedHabits}/{events.habits} habit{events.habits > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Button */}
                <button
                  className="absolute bottom-1 right-1 p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToDate(day);
                  }}
                >
                  <Plus size={12} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks for Selected Date */}
        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Clock size={20} />
              Tasks for {format(selectedDate, 'MMM d, yyyy')}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="space-y-3">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                <Clock size={48} className="mb-4 opacity-50" />
                <p className="mb-4">No tasks scheduled for this date</p>
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

        {/* Habits for Selected Date */}
        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Target size={20} />
              Habits for {format(selectedDate, 'MMM d, yyyy')}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {selectedDateHabits.filter(h => h.isCompleted).length}/{selectedDateHabits.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {selectedDateHabits.length > 0 ? (
              selectedDateHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} compact />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                <Target size={48} className="mb-4 opacity-50" />
                <p className="mb-4">No habits scheduled for this date</p>
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

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          setSelectedDateForAdd(null);
        }}
        onAdd={handleQuickAdd}
      />
    </div>
  );
};

export default Calendar; 