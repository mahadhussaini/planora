import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper function to safely access localStorage
const getStoredTheme = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('theme');
      return saved ? JSON.parse(saved) : null;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  return null;
};

// Helper function to safely access system preference
const getSystemPreference = () => {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  } catch (error) {
    console.warn('Failed to read system color scheme preference:', error);
  }
  return false; // Default to light mode if we can't detect
};

// Helper function to safely set localStorage
const setStoredTheme = (isDarkMode) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', JSON.stringify(isDarkMode));
    }
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // First try to get from localStorage
    const storedTheme = getStoredTheme();
    if (storedTheme !== null) {
      return storedTheme;
    }
    // Fall back to system preference
    return getSystemPreference();
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Mark as initialized after first render
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      setStoredTheme(isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode, isInitialized]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 