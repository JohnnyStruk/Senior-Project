import { createContext, useContext } from 'react';
import type { ThemeConfig } from '../types/keyboard';

interface ThemeContextType {
  theme: ThemeConfig;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}