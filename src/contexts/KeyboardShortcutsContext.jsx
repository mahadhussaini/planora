import { createContext, useContext, useEffect, useCallback } from 'react';
import { useNotification } from './NotificationContext';
import { usePlanner } from './PlannerContext';
import { useNavigate, useLocation } from 'react-router-dom';

const KeyboardShortcutsContext = createContext();

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};

export const KeyboardShortcutsProvider = ({ children }) => {
  const { info } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const shortcuts = {
    // Navigation shortcuts
    'ctrl+1': () => navigate('/'),
    'ctrl+2': () => navigate('/tasks'),
    'ctrl+3': () => navigate('/habits'),
    'ctrl+4': () => navigate('/calendar'),
    'ctrl+5': () => navigate('/settings'),
    
    // General shortcuts
    'ctrl+/': () => showShortcutsHelp(),
    'esc': () => closeModals(),
    
    // Quick actions
    'ctrl+n': () => openQuickAdd(),
    'ctrl+s': () => showSaveNotification(),
  };

  const showShortcutsHelp = useCallback(() => {
    info(`
      Keyboard Shortcuts:
      Ctrl+1: Dashboard
      Ctrl+2: Tasks
      Ctrl+3: Habits
      Ctrl+4: Calendar
      Ctrl+5: Settings
      Ctrl+N: Quick Add
      Ctrl+/: Show this help
      ESC: Close modals
    `, { duration: 8000 });
  }, [info]);

  const closeModals = useCallback(() => {
    // Trigger ESC key press event for modals to catch
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true
    });
    document.dispatchEvent(escEvent);
  }, []);

  const openQuickAdd = useCallback(() => {
    // Trigger a custom event that components can listen to
    const quickAddEvent = new CustomEvent('openQuickAdd');
    document.dispatchEvent(quickAddEvent);
    info('Quick Add opened (Ctrl+N)');
  }, [info]);

  const showSaveNotification = useCallback(() => {
    info('Data is automatically saved!');
  }, [info]);

  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      return;
    }

    const key = [];
    if (event.ctrlKey || event.metaKey) key.push('ctrl');
    if (event.altKey) key.push('alt');
    if (event.shiftKey) key.push('shift');
    
    // Add the actual key
    if (event.key === 'Escape') {
      key.push('esc');
    } else if (event.key === '/') {
      key.push('/');
    } else if (event.key >= '1' && event.key <= '9') {
      key.push(event.key);
    } else if (event.key.toLowerCase() === 'n') {
      key.push('n');
    } else if (event.key.toLowerCase() === 's') {
      key.push('s');
    }

    const shortcut = key.join('+');
    
    if (shortcuts[shortcut]) {
      event.preventDefault();
      event.stopPropagation();
      shortcuts[shortcut]();
    }
  }, [navigate, info]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const value = {
    shortcuts,
    showShortcutsHelp,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};