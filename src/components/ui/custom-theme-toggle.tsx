import React from 'react';
import { useThemeToggle } from '../../hooks/use-theme-toggle';

interface CustomThemeToggleProps {
  className?: string;
}

export const CustomThemeToggle = ({ className = '' }: CustomThemeToggleProps) => {
  const { isDark, toggle, isClient } = useThemeToggle();

  const handleToggleChange = () => {
    toggle();
  };

  // Prevent hydration mismatches by showing loading state during SSR
  if (!isClient) {
    return (
      <div className={className}>
        <label className="theme-toggle-container">
          <input
            type="checkbox"
            checked={false}
            readOnly
            className="theme-toggle-input"
            style={{ opacity: 0.5 }}
          />
          <span className="theme-toggle-slider round">
            <div className="theme-toggle-background"></div>
            <div className="theme-toggle-star"></div>
            <div className="theme-toggle-star"></div>
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="theme-toggle-container">
        <input
          type="checkbox"
          checked={isDark}
          onChange={handleToggleChange}
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