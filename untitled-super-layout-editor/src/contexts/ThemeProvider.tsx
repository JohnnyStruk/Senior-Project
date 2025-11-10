import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeConfig } from '../types/keyboard';

const darkTheme: ThemeConfig = {
  isDark: true,
  colors: {
    background: 'from-slate-950 via-purple-950/20 to-slate-950',
    surface: 'bg-slate-800/40 backdrop-blur-md border-slate-700/50',
    surfaceHover: 'hover:bg-slate-700/60',
    border: 'border-slate-600/30',
    text: 'text-slate-100',
    textSecondary: 'text-slate-400',
    primary: 'bg-indigo-600 hover:bg-indigo-500',
    primaryHover: 'hover:bg-indigo-500',
    accent: 'bg-cyan-500',
    keyDefault: 'bg-slate-700/60 hover:bg-slate-600/80 border-slate-600/40 text-slate-200',
    keyModifier: 'bg-indigo-600/20 hover:bg-indigo-500/30 border-indigo-500/40 text-indigo-200',
    keyFunction: 'bg-emerald-600/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-200',
    keySelected: 'bg-cyan-500/30 border-cyan-400/60 text-cyan-100 shadow-cyan-500/25',
  },
};

const lightTheme: ThemeConfig = {
  isDark: false,
  colors: {
    background: 'from-gray-50 via-blue-50/30 to-gray-50',
    surface: 'bg-white/60 backdrop-blur-md border-gray-200/50',
    surfaceHover: 'hover:bg-white/80',
    border: 'border-gray-300/40',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-indigo-600 hover:bg-indigo-700',
    primaryHover: 'hover:bg-indigo-700',
    accent: 'bg-cyan-500',
    keyDefault: 'bg-white/80 hover:bg-white/95 border-gray-300/50 text-gray-800',
    keyModifier: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300/60 text-indigo-800',
    keyFunction: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300/60 text-emerald-800',
    keySelected: 'bg-cyan-100 border-cyan-400/80 text-cyan-900 shadow-cyan-400/20',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true); // Default to dark mode for modern feel

  useEffect(() => {
    const saved = localStorage.getItem('theme-preference');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      // Check system preference
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme-preference', newTheme ? 'dark' : 'light');
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen bg-gradient-to-br ${theme.colors.background} transition-all duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}