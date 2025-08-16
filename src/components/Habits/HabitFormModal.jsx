import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, AlertCircle } from 'lucide-react';

const HabitFormModal = ({ isOpen, onClose, onSubmit, habit, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        frequency: 'daily',
      });
    }
    setErrors({});
  }, [habit, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const habitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      frequency: formData.frequency,
    };

    onSubmit(habitData);
  };

  const handleDelete = () => {
    if (onDelete && habit) {
      onDelete();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '📊';
      default: return '📅';
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Daily';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content max-w-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {habit ? 'Edit Habit' : 'Add New Habit'}
              </h2>
              <button 
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleClose}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter habit title..."
                  className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {errors.title && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={14} />
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add habit description..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['daily', 'weekly', 'monthly'].map((frequency) => (
                    <button
                      key={frequency}
                      type="button"
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                        formData.frequency === frequency 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                      }`}
                      onClick={() => setFormData({ ...formData, frequency })}
                    >
                      <span className="text-2xl">{getFrequencyIcon(frequency)}</span>
                      <span className="text-sm font-medium">{getFrequencyLabel(frequency)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                {habit && onDelete && (
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    onClick={handleDelete}
                  >
                    <Trash2 size={16} />
                    Delete Habit
                  </button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <Save size={16} />
                    {habit ? 'Update Habit' : 'Create Habit'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HabitFormModal; 