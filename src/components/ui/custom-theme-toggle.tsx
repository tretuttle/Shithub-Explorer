import React, { useState, useEffect } from 'react';

interface CustomThemeToggleProps {
  className?: string;
}

export const CustomThemeToggle: React.FC<CustomThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check initial theme from document or localStorage
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('dark-mode-toggle::/') === '"dark"';
  });
  
  useEffect(() => {
    // Import the dark-mode-toggle web component
    import('dark-mode-toggle');
    
    // Set up initial theme state sync
    const syncThemeState = () => {
      const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
      if (darkModeToggle) {
        const currentMode = darkModeToggle.mode || 'light';
        setIsDark(currentMode === 'dark');
        console.log('Synced theme state:', currentMode);
      }
    };
    
    // Wait for the web component to be ready
    setTimeout(syncThemeState, 100);
    
    // Listen for theme changes from the dark-mode-toggle component
    const handleColorSchemeChange = (e: CustomEvent) => {
      const newIsDark = e.detail.colorScheme === 'dark';
      setIsDark(newIsDark);
      console.log('Theme changed via colorschemechange:', e.detail.colorScheme);
    };

    document.addEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    
    return () => {
      document.removeEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    };
  }, []);

  const handleToggleClick = () => {
    console.log('Custom toggle clicked, current isDark:', isDark);
    
    // Update React state immediately
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    console.log('Updated React state to:', newIsDark ? 'dark' : 'light');
    
    // Apply theme classes immediately
    document.documentElement.classList.toggle('dark', newIsDark);
    document.documentElement.classList.toggle('light', !newIsDark);
    
    // Store in localStorage immediately
    localStorage.setItem('dark-mode-toggle::/', JSON.stringify(newIsDark ? 'dark' : 'light'));
    
    // Try to sync with the dark-mode-toggle component
    const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
    if (darkModeToggle) {
      const newMode = newIsDark ? 'dark' : 'light';
      darkModeToggle.mode = newMode;
      console.log('Synced dark-mode-toggle to:', newMode);
    } else {
      console.log('No dark-mode-toggle element found, using fallback');
    }
  };

  return (
    <div className={className}>
      <label className="theme-toggle-container" onClick={handleToggleClick}>
        <input 
          type="checkbox" 
          checked={isDark}
          readOnly
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