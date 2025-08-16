import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  MoreHorizontal,
  Flame,
  Trophy,
  Clock
} from 'lucide-react';
import { usePlanner } from '../contexts/PlannerContext';
import HabitCard from '../components/Habits/HabitCard';
import HabitFormModal from '../components/Habits/HabitFormModal';
import VirtualizedList from '../components/Common/VirtualizedList';

const Habits = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = usePlanner();
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFrequency = filterFrequency === 'all' || habit.frequency === filterFrequency;
      return matchesSearch && matchesFrequency;
    });
  }, [habits, searchTerm, filterFrequency]);

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const activeHabits = habits.filter(habit => habit.streak > 0).length;
    const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);

    return { totalHabits, activeHabits, bestStreak, totalStreaks };
  }, [habits]);

  const handleHabitClick = (habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  const handleAddHabit = (habitData) => {
    addHabit(habitData);
    setShowHabitForm(false);
  };

  const handleUpdateHabit = (habitData) => {
    updateHabit(editingHabit.id, habitData);
    setEditingHabit(null);
    setShowHabitForm(false);
  };

  const handleDeleteHabit = (habitId) => {
    deleteHabit(habitId);
    if (editingHabit?.id === habitId) {
      setEditingHabit(null);
      setShowHabitForm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
            Habits
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Build lasting habits and track your progress
          </p>
        </div>
        
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          onClick={() => setShowHabitForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          Add Habit
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
            <Target size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalHabits}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Habits</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.activeHabits}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Habits</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
            <Flame size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.bestStreak}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalStreaks}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Streaks</p>
          </div>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>

          <select
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setViewMode('grid')}
          >
            <BarChart3 size={20} />
          </button>
          <button
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setViewMode('list')}
          >
            <Clock size={20} />
          </button>
        </div>
      </div>

      {/* Habits Grid/List */}
      {filteredHabits.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleHabitClick(habit)}
                className="cursor-pointer"
              >
                <HabitCard habit={habit} showActions={true} />
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View with Virtual Scrolling for large lists */
          filteredHabits.length > 10 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  All Habits ({filteredHabits.length})
                </h3>
              </div>
              
              <VirtualizedList
                items={filteredHabits.sort((a, b) => {
                  // Sort by streak (descending), then by creation date
                  if (a.streak !== b.streak) {
                    return b.streak - a.streak;
                  }
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })}
                itemHeight={140}
                containerHeight={600}
                renderItem={(habit) => (
                  <div className="px-4 py-2">
                    <HabitCard habit={habit} showActions={true} />
                  </div>
                )}
                onItemClick={handleHabitClick}
                className="w-full"
              />
            </div>
          ) : (
            /* Regular list for smaller lists */
            <div className="space-y-4">
              {filteredHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleHabitClick(habit)}
                  className="cursor-pointer"
                >
                  <HabitCard habit={habit} showActions={true} />
                </motion.div>
              ))}
            </div>
          )
        )
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <Target size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No habits found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {searchTerm || filterFrequency !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start building your first habit to track your progress and build lasting positive changes.'
            }
          </p>
          {!searchTerm && filterFrequency === 'all' && (
            <button
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              onClick={() => setShowHabitForm(true)}
            >
              Create Your First Habit
            </button>
          )}
        </motion.div>
      )}

      {/* Habit Form Modal */}
      <HabitFormModal
        isOpen={showHabitForm}
        onClose={() => {
          setShowHabitForm(false);
          setEditingHabit(null);
        }}
        onSubmit={editingHabit ? handleUpdateHabit : handleAddHabit}
        habit={editingHabit}
        onDelete={editingHabit ? () => handleDeleteHabit(editingHabit.id) : null}
      />
    </div>
  );
};

export default Habits; 