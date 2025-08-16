import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Moon,
  Sun,
  Download,
  Upload,
  Trash2,
  Bell,
  Shield,
  Palette,
  Database,
  User,
  Info
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { usePlanner } from '../contexts/PlannerContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { tasks, habits, exportData, importData, clearAllData } = usePlanner();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    exportData();
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          importData(data);
        } catch (error) {
          console.error('Import error:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleClearAllData = () => {
    clearAllData();
    setShowDeleteConfirm(false);
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: isDarkMode,
          onChange: toggleTheme,
          icon: isDarkMode ? Moon : Sun
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Enable Notifications',
          description: 'Receive reminders for tasks and habits',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        }
      ]
    },
    {
      title: 'Data Management',
      icon: Database,
      items: [
        {
          label: 'Auto Backup',
          description: 'Automatically backup your data',
          type: 'toggle',
          value: autoBackup,
          onChange: setAutoBackup
        },
        {
          label: 'Export Data',
          description: 'Download your data as a backup file',
          type: 'button',
          onClick: handleExportData,
          icon: Download
        },
        {
          label: 'Import Data',
          description: 'Restore data from a backup file',
          type: 'file',
          onChange: handleImportData,
          icon: Upload
        },
        {
          label: 'Clear All Data',
          description: 'Delete all tasks and habits permanently',
          type: 'button',
          onClick: () => setShowDeleteConfirm(true),
          icon: Trash2,
          danger: true
        }
      ]
    },
    {
      title: 'About',
      icon: Info,
      items: [
        {
          label: 'Version',
          description: 'Planora v1.0.0',
          type: 'info'
        },
        {
          label: 'Developer',
          description: 'Built with React, Tailwind CSS, and Framer Motion',
          type: 'info'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Customize your Planora experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <section.icon size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {section.items.map((item, itemIndex) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {item.icon && (
                        <item.icon size={16} className="text-gray-400" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {item.type === 'toggle' && (
                      <button
                        onClick={item.onChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value 
                            ? 'bg-primary-600' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}

                    {item.type === 'button' && (
                      <button
                        onClick={item.onClick}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          item.danger
                            ? 'text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                        }`}
                      >
                        {item.icon && <item.icon size={16} />}
                        {item.label}
                      </button>
                    )}

                    {item.type === 'file' && (
                      <label className="flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer">
                        {item.icon && <item.icon size={16} />}
                        {item.label}
                        <input
                          type="file"
                          accept=".json"
                          onChange={item.onChange}
                          className="hidden"
                        />
                      </label>
                    )}

                    {item.type === 'info' && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <Trash2 size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Clear All Data
              </h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will permanently delete all your tasks and habits. This action cannot be undone. Are you sure you want to continue?
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete All Data
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings; 