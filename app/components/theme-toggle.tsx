'use client';

import { useThemeToggle } from '@tirbeo/theme';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { isDark, toggle } = useThemeToggle();

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="h-5 w-5" strokeWidth={2} />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={2} />
      )}
    </button>
  );
}
