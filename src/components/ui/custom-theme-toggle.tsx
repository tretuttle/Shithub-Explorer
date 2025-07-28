import React, { useState, useEffect } from 'react';

interface CustomThemeToggleProps {
  className?: string;
}

export const CustomThemeToggle: React.FC<CustomThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Import the dark-mode-toggle web component
    import('dark-mode-toggle');
    
    // Get initial theme state
    const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
    if (darkModeToggle) {
      setIsDark(darkModeToggle.mode === 'dark');
    }
    
    // Listen for theme changes from the dark-mode-toggle component
    const handleColorSchemeChange = (e: CustomEvent) => {
      const newIsDark = e.detail.colorScheme === 'dark';
      setIsDark(newIsDark);
    };

    document.addEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    
    return () => {
      document.removeEventListener('colorschemechange', handleColorSchemeChange as EventListener);
    };
  }, []);

  const handleToggleClick = () => {
    // Trigger the hidden dark-mode-toggle component
    const darkModeToggle = document.querySelector('#github-toolkit-theme-toggle') as any;
    if (darkModeToggle) {
      darkModeToggle.click();
    }
  };

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