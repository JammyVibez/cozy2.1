'use client';

import { useEffect } from 'react';
import { useCosmetics } from './CosmeticProvider';

export function ThemeInjector() {
  const { getActiveCosmetic } = useCosmetics();

  useEffect(() => {
    const activeTheme = getActiveCosmetic('THEME');
    
    // Remove existing theme CSS
    const existingTheme = document.getElementById('active-theme-css');
    if (existingTheme) {
      existingTheme.remove();
    }

    // Inject new theme CSS if exists
    if (activeTheme?.assetUrl) {
      const link = document.createElement('link');
      link.id = 'active-theme-css';
      link.rel = 'stylesheet';
      link.href = activeTheme.assetUrl;
      link.onload = () => {
        console.log('Theme loaded:', activeTheme.name);
      };
      link.onerror = () => {
        console.error('Failed to load theme:', activeTheme.name);
      };
      document.head.appendChild(link);
    }
  }, [getActiveCosmetic]);

  return null;
}