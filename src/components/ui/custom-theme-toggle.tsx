import React, { useState, useEffect } from 'react';

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
    // Just import the dark-mode-toggle web component, no event listeners
    import('dark-mode-toggle');
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