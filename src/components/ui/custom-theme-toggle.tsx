import React, { useState, useEffect, useCallback } from 'react';

interface CustomThemeToggleProps {
  className?: string;
}

export const CustomThemeToggle: React.FC<CustomThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Listen for changes from the dark-mode-toggle system
    const handleColorSchemeChange = (e: CustomEvent) => {
      const newIsDark = e.detail.colorScheme === 'dark';
      console.log('Received colorschemechange event:', newIsDark);
      setIsDark(newIsDark);
    };

    // Get initial state from dark-mode-toggle
    const updateFromDarkModeToggle = () => {
      const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
      if (darkModeToggle) {
        const currentMode = darkModeToggle.mode;
        const newIsDark = currentMode === 'dark';
        console.log('Initial dark-mode-toggle state:', currentMode);
        setIsDark(newIsDark);
      }
    };

    // Set up event listener
    document.addEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    
    // Check initial state after a short delay to ensure dark-mode-toggle is ready
    const timer = setTimeout(updateFromDarkModeToggle, 100);
    
    return () => {
      document.removeEventListener('colorschemechange', handleColorSchemeChange as EventListener);
      clearTimeout(timer);
    };
  }, []);

  // Function to apply View Transitions API
  const applyViewTransition = useCallback((callback: () => void) => {
    if (document.startViewTransition) {
      document.startViewTransition(callback);
    } else {
      callback();
    }
  }, []);

  const handleToggleClick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Custom toggle clicked, telling dark-mode-toggle to toggle');
    
    // Get the dark-mode-toggle element and let it handle the logic
    const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
    if (darkModeToggle) {
      // Apply View Transitions API to the toggle action
      applyViewTransition(() => {
        darkModeToggle.toggleMode(); // Let dark-mode-toggle handle all the system logic
      });
    } else {
      console.warn('Dark mode toggle element not found');
    }
  }, [applyViewTransition]);

  return (
    <div className={className}>
      <label className="theme-toggle-container">
        <input 
          type="checkbox" 
          checked={isDark}
          onChange={handleToggleClick}
          className="theme-toggle-input"
        />
        <span className="theme-toggle-slider round">
          <div className="theme-toggle-background"></div>
          <div className="theme-toggle-star"></div>
          <div className="theme-toggle-star"></div>
        </span>
      </label>
    </div>
  );
};