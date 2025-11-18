import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create the context
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider component that manages theme state and persistence
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  // Use custom hook to persist theme preference
  // Default to 'light' theme if no preference exists
  const [theme, setTheme] = useLocalStorage('instagram-viewer-theme', 'light');

  // Apply theme class to document root whenever theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context value with theme and toggleTheme
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
