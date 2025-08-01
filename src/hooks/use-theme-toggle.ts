import { useState, useEffect, useCallback } from 'react';

// Constants matching the dark-mode-toggle approach
const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';
const PREFERS_COLOR_SCHEME_DARK = '(prefers-color-scheme: dark)';

export interface UseThemeToggleReturn {
  isDark: boolean;
  toggle: () => void;
  isClient: boolean; // For preventing hydration mismatches
}

/**
 * SSR-safe theme toggle hook that provides reliable theme management
 * with localStorage persistence and system preference detection.
 * 
 * This hook eliminates race conditions by providing a single source of truth
 * for theme state and handles all browser API access safely.
 */
export function useThemeToggle(): UseThemeToggleReturn {
  // Track if we're on the client to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize client-side state and theme detection
  useEffect(() => {
    setIsClient(true);

    // Guard all browser API access
    if (typeof window === 'undefined') {
      return;
    }

    let savedTheme: string | null = null;
    let systemPrefersDark = false;

    // Safely access localStorage
    try {
      savedTheme = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.warn('localStorage access blocked or unavailable:', error);
    }

    // Safely detect system preference
    try {
      if (window.matchMedia) {
        systemPrefersDark = window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches;
      }
    } catch (error) {
      console.warn('matchMedia unavailable:', error);
    }

    // Determine initial theme state following dark-mode-toggle logic:
    // 1. Check localStorage first for saved preference
    // 2. Fall back to system preference if no saved value
    // 3. Default to light if nothing is available
    let initialIsDark = false;
    if (savedTheme === DARK || savedTheme === LIGHT) {
      initialIsDark = savedTheme === DARK;
    } else {
      initialIsDark = systemPrefersDark;
    }

    console.log('🎨 THEME DEBUG: Initial theme setup', {
      savedTheme,
      systemPrefersDark,
      initialIsDark,
      documentClasses: document.documentElement.className
    });

    // Apply theme immediately to prevent flashing
    applyThemeToDOM(initialIsDark);
    setIsDark(initialIsDark);

    // Set up system preference listener only if no saved preference exists
    let mediaQueryList: MediaQueryList | null = null;
    let mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

    if (!savedTheme && window.matchMedia) {
      try {
        mediaQueryList = window.matchMedia(PREFERS_COLOR_SCHEME_DARK);
        mediaQueryHandler = (e: MediaQueryListEvent) => {
          // Only respond to system changes if no user preference is saved
          try {
            const currentSavedTheme = localStorage.getItem(STORAGE_KEY);
            if (!currentSavedTheme) {
              const newIsDark = e.matches;
              applyThemeToDOM(newIsDark);
              setIsDark(newIsDark);
            }
          } catch (error) {
            console.warn('Error handling system theme change:', error);
          }
        };

        // Add listener with both old and new API support
        if (mediaQueryList.addEventListener) {
          mediaQueryList.addEventListener('change', mediaQueryHandler);
        } else if (mediaQueryList.addListener) {
          // Fallback for older browsers
          mediaQueryList.addListener(mediaQueryHandler);
        }
      } catch (error) {
        console.warn('Error setting up system preference listener:', error);
      }
    }

    // Cleanup function
    return () => {
      if (mediaQueryList && mediaQueryHandler) {
        try {
          if (mediaQueryList.removeEventListener) {
            mediaQueryList.removeEventListener('change', mediaQueryHandler);
          } else if (mediaQueryList.removeListener) {
            // Fallback for older browsers
            mediaQueryList.removeListener(mediaQueryHandler);
          }
        } catch (error) {
          console.warn('Error removing system preference listener:', error);
        }
      }
    };
  }, []);

  /**
   * Applies theme to DOM by toggling the 'dark' class on documentElement
   * This approach is compatible with Tailwind's class-based dark mode
   */
  const applyThemeToDOM = useCallback((darkMode: boolean) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    try {
      console.log('🎨 THEME DEBUG: Applying theme to DOM', {
        darkMode,
        currentClasses: document.documentElement.className,
        hasLight: document.documentElement.classList.contains('light'),
        hasDark: document.documentElement.classList.contains('dark')
      });
      
      document.documentElement.classList.toggle('dark', darkMode);
      
      console.log('🎨 THEME DEBUG: After DOM update', {
        newClasses: document.documentElement.className,
        hasLight: document.documentElement.classList.contains('light'),
        hasDark: document.documentElement.classList.contains('dark'),
        computedBackgroundColor: window.getComputedStyle(document.documentElement).backgroundColor,
        computedForegroundColor: window.getComputedStyle(document.documentElement).color
      });
    } catch (error) {
      console.warn('Error applying theme to DOM:', error);
    }
  }, []);

  /**
   * Toggles the theme and persists the choice to localStorage
   * Always saves user-initiated changes to override system preference
   */
  const toggle = useCallback(() => {
    if (!isClient) {
      return; // Prevent execution during SSR
    }

    const newIsDark = !isDark;
    
    console.log('🎨 THEME DEBUG: Toggle initiated', {
      currentIsDark: isDark,
      newIsDark,
      isClient,
      savedTheme: localStorage.getItem(STORAGE_KEY)
    });
    
    // Apply theme immediately
    applyThemeToDOM(newIsDark);
    setIsDark(newIsDark);

    // Persist user choice to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, newIsDark ? DARK : LIGHT);
      console.log('🎨 THEME DEBUG: Theme saved to localStorage', newIsDark ? DARK : LIGHT);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [isDark, isClient, applyThemeToDOM]);

  return {
    isDark,
    toggle,
    isClient
  };
}