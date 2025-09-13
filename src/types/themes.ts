export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeVariant = 'default' | 'gojo' | 'sakura' | 'ocean' | 'forest' | 'sunset' | 'neon';

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  primary: string;
  'primary-foreground': string;
  'primary-accent': string;
  secondary: string;
  'secondary-foreground': string;
  'secondary-accent': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  success: string;
  'success-foreground': string;
  warning: string;
  'warning-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  border: string;
  input: string;
}

export interface EnhancedTheme {
  mode: ThemeMode;
  variant: ThemeVariant;
  actualMode: 'light' | 'dark';
}