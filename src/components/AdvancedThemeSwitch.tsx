'use client';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { WeatherSun, WeatherMoon, DeviceLaptop } from '@/svg_components';
import { cn } from '@/lib/cn';

export function AdvancedThemeSwitch() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { key: 'light', icon: WeatherSun, label: 'Light' },
    { key: 'dark', icon: WeatherMoon, label: 'Dark' },
    { key: 'system', icon: DeviceLaptop, label: 'System' },
  ] as const;

  return (
    <div className="relative bg-muted rounded-lg p-1 flex">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={cn(
            'relative flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200',
            'text-sm font-medium min-w-0 flex-1 justify-center',
            theme === key
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {theme === key && (
            <motion.div
              layoutId="theme-indicator"
              className="absolute inset-0 bg-background rounded-md shadow-sm"
              transition={{ duration: 0.2 }}
            />
          )}
          <Icon className="w-4 h-4 relative z-10" />
          <span className="relative z-10 hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Quick theme toggle button
export function QuickThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-lg transition-colors',
        'hover:bg-muted active:scale-95 transition-transform'
      )}
      aria-label="Toggle theme"
    >
      <motion.div
        key={actualTheme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {actualTheme === 'light' ? (
          <WeatherMoon className="w-5 h-5" />
        ) : (
          <WeatherSun className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
}