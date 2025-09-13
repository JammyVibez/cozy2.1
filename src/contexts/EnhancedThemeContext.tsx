'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode, ThemeVariant, EnhancedTheme } from '@/types/themes';
import { themeDefinitions } from '@/lib/themes/themeDefinitions';
import { applyTheme } from '@/lib/themes/themeUtils';

interface EnhancedThemeContextType {
  theme: EnhancedTheme;
  setMode: (mode: ThemeMode) => void;
  setVariant: (variant: ThemeVariant) => void;
  toggleMode: () => void;
  availableVariants: { key: ThemeVariant; name: string; description: string }[];
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined);

export function EnhancedThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<EnhancedTheme>({
    mode: 'system',
    variant: 'default',
    actualMode: 'light',
  });

  // Load saved theme preferences on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode || 'system';
    const savedVariant = localStorage.getItem('theme-variant') as ThemeVariant || 'default';
    
    setTheme(prev => ({
      ...prev,
      mode: savedMode,
      variant: savedVariant,
    }));
  }, []);

  // Update actual mode based on system preference or user selection
  useEffect(() => {
    const updateActualMode = () => {
      if (theme.mode === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prev => ({
          ...prev,
          actualMode: systemPrefersDark ? 'dark' : 'light',
        }));
      } else {
        setTheme(prev => ({
          ...prev,
          actualMode: theme.mode === 'dark' ? 'dark' : 'light',
        }));
      }
    };

    updateActualMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme.mode === 'system') {
        updateActualMode();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme.mode]);

  // Apply theme to DOM when theme changes
  useEffect(() => {
    applyTheme(theme.variant, theme.actualMode);
    
    // Save preferences to localStorage
    localStorage.setItem('theme-mode', theme.mode);
    localStorage.setItem('theme-variant', theme.variant);
  }, [theme.variant, theme.actualMode, theme.mode]);

  const setMode = useCallback((mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  }, []);

  const setVariant = useCallback((variant: ThemeVariant) => {
    setTheme(prev => ({ ...prev, variant }));
  }, []);

  const toggleMode = useCallback(() => {
    const newMode: ThemeMode = theme.actualMode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [theme.actualMode, setMode]);

  const availableVariants = Object.entries(themeDefinitions).map(([key, config]) => ({
    key: key as ThemeVariant,
    name: config.name,
    description: config.description,
  }));

  const value: EnhancedThemeContextType = {
    theme,
    setMode,
    setVariant,
    toggleMode,
    availableVariants,
  };

  return (
    <EnhancedThemeContext.Provider value={value}>
      {children}
    </EnhancedThemeContext.Provider>
  );
}

export function useEnhancedTheme() {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
}