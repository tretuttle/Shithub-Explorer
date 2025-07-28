import React, { useState, useEffect, useCallback } from 'react';

interface CustomThemeToggleProps {
  className?: string;
}

export const CustomThemeToggle: React.FC<CustomThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check document class first
    const hasDocumentDark = document.documentElement.classList.contains('dark');
    
    // Check localStorage with proper parsing
    let localStorageTheme = null;
    try {
      const stored = localStorage.getItem('dark-mode-toggle::/');
      if (stored) {
        localStorageTheme = JSON.parse(stored);
      }
    } catch (e) {
      console.log('Error parsing localStorage theme:', e);
    }
    
    const initialIsDark = hasDocumentDark || localStorageTheme === 'dark';
    console.log('Initial theme detection:', {
      hasDocumentDark,
      localStorageTheme,
      initialIsDark
    });
    
    return initialIsDark;
  });
  
  useEffect(() => {
    import('dark-mode-toggle');
  }, []);

  // Function to switch theme with View Transitions API support
  const switchTheme = useCallback((newIsDark: boolean) => {
    console.log('Switching theme to:', newIsDark ? 'dark' : 'light');
    
    // Apply theme classes
    document.documentElement.classList.toggle('dark', newIsDark);
    document.documentElement.classList.toggle('light', !newIsDark);
    
    // Store in localStorage
    localStorage.setItem('dark-mode-toggle::/', JSON.stringify(newIsDark ? 'dark' : 'light'));
    
    // Sync with hidden dark-mode-toggle component
    const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
    if (darkModeToggle) {
      darkModeToggle.mode = newIsDark ? 'dark' : 'light';
    }
  }, []);

  const handleToggleClick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Custom toggle clicked, current isDark:', isDark);
    
    // Use functional state update to ensure we're working with latest state
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      console.log('State update: prev =', prevIsDark, ', new =', newIsDark);
      
      // Apply theme changes with View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => switchTheme(newIsDark));
      } else {
        switchTheme(newIsDark);
      }
      
      return newIsDark;
    });
  }, [isDark, switchTheme]);

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