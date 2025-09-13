'use client';

import React, { useState } from 'react';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { ThemeMode, ThemeVariant } from '@/types/themes';
import { generateThemePreview } from '@/lib/themes/themeUtils';
import { cn } from '@/lib/cn';

export function ThemeSelector({ className }: { className?: string }) {
  const { theme, setMode, setVariant, availableVariants } = useEnhancedTheme();
  const [isOpen, setIsOpen] = useState(false);

  const modes: { key: ThemeMode; label: string; icon: string }[] = [
    { key: 'light', label: 'Light', icon: '☀️' },
    { key: 'dark', label: 'Dark', icon: '🌙' },
    { key: 'system', label: 'System', icon: '💻' },
  ];

  const handleModeChange = (mode: ThemeMode) => {
    setMode(mode);
  };

  const handleVariantChange = (variant: ThemeVariant) => {
    setVariant(variant);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
        aria-label="Theme selector"
      >
        <span className="text-sm font-medium">🎨 Theme</span>
        <span className="text-xs text-muted-foreground capitalize">
          {availableVariants.find(v => v.key === theme.variant)?.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme selector panel */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 p-4">
            {/* Mode selector */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Mode</h3>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {modes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => handleModeChange(mode.key)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors',
                      theme.mode === mode.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variant selector */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Theme Variant</h3>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {availableVariants.map((variant) => {
                  const preview = generateThemePreview(variant.key, theme.actualMode);
                  const isSelected = theme.variant === variant.key;
                  
                  return (
                    <button
                      key={variant.key}
                      onClick={() => handleVariantChange(variant.key)}
                      className={cn(
                        'relative p-3 rounded-lg border-2 transition-all hover:scale-105',
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-accent-foreground'
                      )}
                      style={{ backgroundColor: preview.background }}
                    >
                      {/* Theme preview */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: preview.primary }}
                          />
                          <div 
                            className="w-8 h-2 rounded"
                            style={{ backgroundColor: preview.accent }}
                          />
                        </div>
                        <div 
                          className="w-full h-4 rounded"
                          style={{ backgroundColor: preview.card }}
                        />
                        <div className="flex gap-1">
                          <div 
                            className="flex-1 h-2 rounded"
                            style={{ backgroundColor: preview.accent }}
                          />
                          <div 
                            className="w-6 h-2 rounded"
                            style={{ backgroundColor: preview.primary }}
                          />
                        </div>
                      </div>
                      
                      {/* Theme info */}
                      <div className="mt-2 text-left">
                        <div 
                          className="text-xs font-medium"
                          style={{ color: preview.foreground }}
                        >
                          {variant.name}
                        </div>
                        <div 
                          className="text-xs opacity-70 mt-1"
                          style={{ color: preview.foreground }}
                        >
                          {variant.description}
                        </div>
                      </div>
                      
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Close button */}
            <div className="mt-4 pt-3 border-t border-border">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}