import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, startOfDay, endOfDay, isToday, isYesterday, isTomorrow } from 'date-fns';
import { useNotification } from './NotificationContext';

const PlannerContext = createContext();

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};

// Helper function to safely access localStorage
const getStoredData = (key, defaultValue = []) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    }
  } catch (error) {
    console.warn(`Failed to read ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Helper function to safely set localStorage
const setStoredData = (key, data) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

export const PlannerProvider = ({ children }) => {
  const { success, error, info } = useNotification();
  
  const [tasks, setTasks] = useState(() => {
    return getStoredData('planora-tasks', []);
  });

  const [habits, setHabits] = useState(() => {
    return getStoredData('planora-habits', []);
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Save to localStorage whenever data changes
  useEffect(() => {
    setStoredData('planora-tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    setStoredData('planora-habits', habits);
  }, [habits]);

  // Task management
  const addTask = useCallback((task) => {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      tags: task.tags || [],
      ...task,
    };
    setTasks(prev => [...prev, newTask]);
    success(`Task "${task.title}" created successfully!`);
    return newTask;
  }, [success]);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    info('Task updated successfully!');
  }, [info]);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    success('Task deleted successfully!');
  }, [success]);

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  }, []);

  const completeTask = useCallback((id) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
        : task
    ));
    success('Task completed! Great job! 🎉');
  }, [success]);

  // Habit management
  const addHabit = useCallback((habit) => {
    const newHabit = {
      id: Date.now().toString(),
      title: habit.title,
      description: habit.description || '',
      frequency: habit.frequency || 'daily',
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
      completedDates: [],
      ...habit,
    };
    setHabits(prev => [...prev, newHabit]);
    success(`Habit "${habit.title}" created! Let's build this habit! 💪`);
    return newHabit;
  }, [success]);

  const updateHabit = useCallback((id, updates) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    success('Habit deleted successfully!');
  }, [success]);

  const completeHabit = useCallback((id, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let streakMessage = '';
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const completedDates = [...habit.completedDates];
        if (!completedDates.includes(dateStr)) {
          completedDates.push(dateStr);
        }

        // Calculate streak
        let streak = 0;
        let currentDate = new Date();
        while (completedDates.includes(format(currentDate, 'yyyy-MM-dd'))) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }

        const newLongestStreak = Math.max(habit.longestStreak, streak);
        const isNewRecord = newLongestStreak > habit.longestStreak;
        
        streakMessage = isNewRecord 
          ? `🔥 New record! ${streak} day streak for "${habit.title}"!`
          : `✅ Habit completed! ${streak} day streak for "${habit.title}"!`;

        return {
          ...habit,
          completedDates,
          streak,
          longestStreak: newLongestStreak,
        };
      }
      return habit;
    }));
    
    if (streakMessage) {
      success(streakMessage);
    }
  }, [success]);

  // Get tasks for a specific date
  const getTasksForDate = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = format(new Date(task.dueDate), 'yyyy-MM-dd');
      return taskDate === dateStr;
    });
  }, [tasks]);

  // Get habits for a specific date
  const getHabitsForDate = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habits.map(habit => ({
      ...habit,
      isCompleted: habit.completedDates.includes(dateStr),
    }));
  }, [habits]);

  // Advanced AI suggestions with smart prioritization
  const getAISuggestions = useCallback(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const todayTasks = getTasksForDate(today);
    const tomorrowTasks = getTasksForDate(tomorrow);
    const overdueTasks = tasks.filter(task =>
      task.dueDate && new Date(task.dueDate) < startOfDay(today) && task.status !== 'completed'
    );
    const upcomingTasks = tasks.filter(task =>
      task.dueDate && new Date(task.dueDate) <= nextWeek && new Date(task.dueDate) > today && task.status !== 'completed'
    );
    const highPriorityTasks = tasks.filter(task => 
      task.priority === 'high' && task.status !== 'completed'
    );
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');

    // Calculate productivity metrics
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
    const avgTasksPerDay = totalTasks > 0 ? totalTasks / 7 : 0; // Assuming weekly view

    // Get habit completion stats
    const todayHabits = getHabitsForDate(today);
    const completedTodayHabits = todayHabits.filter(h => h.isCompleted);
    const habitCompletionRate = todayHabits.length > 0 ? (completedTodayHabits.length / todayHabits.length) * 100 : 0;

    const suggestions = [];

    // Priority-based suggestions
    if (overdueTasks.length > 0) {
      const urgentOverdue = overdueTasks.filter(task => task.priority === 'high');
      suggestions.push({
        type: 'urgent',
        priority: 'high',
        title: 'Urgent: Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task(s)${urgentOverdue.length > 0 ? `, including ${urgentOverdue.length} high-priority` : ''}. Focus on these first!`,
        tasks: overdueTasks.sort((a, b) => {
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }),
        action: 'reschedule',
        icon: '🚨'
      });
    }

    // Workload management
    if (todayTasks.length > 6) {
      suggestions.push({
        type: 'workload',
        priority: 'medium',
        title: 'Heavy Workload Detected',
        message: `You have ${todayTasks.length} tasks today. Consider redistributing some to tomorrow or later.`,
        tasks: todayTasks.filter(task => task.priority !== 'high').slice(6),
        action: 'redistribute',
        icon: '⚖️'
      });
    } else if (todayTasks.length === 0 && tomorrowTasks.length === 0) {
      suggestions.push({
        type: 'planning',
        priority: 'low',
        title: 'Plan Ahead',
        message: 'No tasks scheduled for today or tomorrow. Consider planning some productive activities!',
        tasks: [],
        action: 'plan',
        icon: '📅'
      });
    }

    // High priority focus
    if (highPriorityTasks.length > 0 && inProgressTasks.length > 2) {
      suggestions.push({
        type: 'focus',
        priority: 'high',
        title: 'Focus Recommendation',
        message: `You have ${highPriorityTasks.length} high-priority tasks but ${inProgressTasks.length} tasks in progress. Consider completing current tasks before starting new ones.`,
        tasks: highPriorityTasks,
        action: 'focus',
        icon: '🎯'
      });
    }

    // Productivity insights
    if (completionRate < 50 && totalTasks > 5) {
      suggestions.push({
        type: 'productivity',
        priority: 'medium',
        title: 'Boost Your Productivity',
        message: `Your task completion rate is ${completionRate.toFixed(1)}%. Try breaking large tasks into smaller, manageable pieces.`,
        tasks: tasks.filter(task => task.status === 'todo' && task.description.length > 100),
        action: 'breakdown',
        icon: '📈'
      });
    } else if (completionRate > 80) {
      suggestions.push({
        type: 'achievement',
        priority: 'low',
        title: 'Great Progress!',
        message: `Excellent! You have a ${completionRate.toFixed(1)}% completion rate. Keep up the momentum!`,
        tasks: [],
        action: 'celebrate',
        icon: '🎉'
      });
    }

    // Habit suggestions
    if (habitCompletionRate < 50 && todayHabits.length > 0) {
      suggestions.push({
        type: 'habits',
        priority: 'medium',
        title: 'Habit Reminder',
        message: `You've completed ${completedTodayHabits.length}/${todayHabits.length} habits today. Small consistent actions lead to big results!`,
        tasks: [],
        action: 'habits',
        icon: '🔄'
      });
    }

    // Time-based suggestions
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 11 && highPriorityTasks.length > 0) {
      suggestions.push({
        type: 'timing',
        priority: 'medium',
        title: 'Peak Performance Time',
        message: 'It\'s prime focus time! Consider tackling your most challenging tasks now.',
        tasks: highPriorityTasks.slice(0, 3),
        action: 'tackle',
        icon: '⚡'
      });
    }

    // Upcoming deadlines
    if (upcomingTasks.length > 0) {
      const soonDue = upcomingTasks.filter(task => {
        const daysUntilDue = Math.ceil((new Date(task.dueDate) - today) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 2;
      });
      
      if (soonDue.length > 0) {
        suggestions.push({
          type: 'deadline',
          priority: 'high',
          title: 'Upcoming Deadlines',
          message: `${soonDue.length} task(s) due in the next 2 days. Plan accordingly!`,
          tasks: soonDue,
          action: 'prepare',
          icon: '⏰'
        });
      }
    }

    // Sort suggestions by priority
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return suggestions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }, [tasks, habits, getTasksForDate, getHabitsForDate]);

  // Data management functions
  const importData = useCallback((data) => {
    try {
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        success(`Imported ${data.tasks.length} tasks successfully!`);
      }
      if (data.habits && Array.isArray(data.habits)) {
        setHabits(data.habits);
        success(`Imported ${data.habits.length} habits successfully!`);
      }
      info('Data import completed successfully!');
    } catch (err) {
      error('Failed to import data. Please check the file format.');
    }
  }, [success, error, info]);

  const exportData = useCallback(() => {
    const data = {
      tasks,
      habits,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planora-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    success('Data exported successfully!');
  }, [tasks, habits, success]);

  const clearAllData = useCallback(() => {
    setTasks([]);
    setHabits([]);
    success('All data cleared successfully!');
  }, [success]);

  const value = {
    tasks,
    habits,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    completeTask,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    getTasksForDate,
    getHabitsForDate,
    getAISuggestions,
    importData,
    exportData,
    clearAllData,
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
}; 