import { ThemeVariant, ThemeColors } from '@/types/themes';
import { themeDefinitions } from './themeDefinitions';

export function applyTheme(variant: ThemeVariant, mode: 'light' | 'dark') {
  const themeConfig = themeDefinitions[variant];
  if (!themeConfig) {
    console.warn(`Theme variant '${variant}' not found, falling back to default`);
    return applyTheme('default', mode);
  }

  const colors = themeConfig.colors[mode];
  const root = document.documentElement;

  // Remove any existing theme classes
  root.classList.remove('light', 'dark');
  
  // Add current mode class
  root.classList.add(mode);

  // Apply CSS custom properties
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Add theme variant as data attribute for custom styling
  root.setAttribute('data-theme', variant);
}

export function getThemeColors(variant: ThemeVariant, mode: 'light' | 'dark'): ThemeColors {
  const themeConfig = themeDefinitions[variant];
  if (!themeConfig) {
    return themeDefinitions.default.colors[mode];
  }
  return themeConfig.colors[mode];
}

export function getContrastColor(backgroundColor: string): string {
  // Convert RGB string to array of numbers
  const rgb = backgroundColor.split(' ').map(num => parseInt(num));
  
  // Calculate luminance using relative luminance formula
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  
  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '0 0 0' : '255 255 255';
}

export function generateThemePreview(variant: ThemeVariant, mode: 'light' | 'dark') {
  const colors = getThemeColors(variant, mode);
  return {
    background: `rgb(${colors.background})`,
    foreground: `rgb(${colors.foreground})`,
    primary: `rgb(${colors.primary})`,
    accent: `rgb(${colors.accent})`,
    card: `rgb(${colors.card})`,
  };
}