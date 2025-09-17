'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Integration {
  id: string;
  name: string;
  icon: string;
  isConnected: boolean;
  category: string;
}

interface IntegrationStatusIndicatorProps {
  userId?: string;
  showCount?: boolean;
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IntegrationStatusIndicator({ 
  userId, 
  showCount = true, 
  maxDisplay = 4,
  size = 'md',
  className 
}: IntegrationStatusIndicatorProps) {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectedIntegrations();
  }, [userId]);

  const fetchConnectedIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        const connected = data.integrations.filter((integration: Integration) => integration.isConnected);
        setConnectedIntegrations(connected);
      }
    } catch (error) {
      console.error('Error fetching connected integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="animate-pulse bg-muted rounded-full w-6 h-6"></div>
        {showCount && <div className="animate-pulse bg-muted rounded w-8 h-4"></div>}
      </div>
    );
  }

  if (connectedIntegrations.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
        <div className={cn(
          'rounded-full bg-muted flex items-center justify-center',
          size === 'sm' && 'w-5 h-5 text-xs',
          size === 'md' && 'w-6 h-6 text-sm',
          size === 'lg' && 'w-8 h-8 text-base'
        )}>
          🔗
        </div>
        {showCount && (
          <span className={cn(
            'text-muted-foreground font-medium',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base'
          )}>
            No apps connected
          </span>
        )}
      </div>
    );
  }

  const displayIntegrations = connectedIntegrations.slice(0, maxDisplay);
  const remainingCount = connectedIntegrations.length - maxDisplay;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Integration Icons */}
      <div className="flex -space-x-1">
        {displayIntegrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'rounded-full bg-background border-2 border-background flex items-center justify-center relative',
              size === 'sm' && 'w-5 h-5 text-xs',
              size === 'md' && 'w-6 h-6 text-sm',
              size === 'lg' && 'w-8 h-8 text-base'
            )}
            title={integration.name}
          >
            <div className={cn(
              'w-full h-full rounded-full flex items-center justify-center',
              integration.category === 'social' && 'bg-blue-100 dark:bg-blue-900',
              integration.category === 'developer' && 'bg-green-100 dark:bg-green-900',
              integration.category === 'finance' && 'bg-yellow-100 dark:bg-yellow-900',
              integration.category === 'entertainment' && 'bg-purple-100 dark:bg-purple-900',
              integration.category === 'gaming' && 'bg-red-100 dark:bg-red-900',
              integration.category === 'professional' && 'bg-gray-100 dark:bg-gray-900'
            )}>
              {integration.icon}
            </div>
            
            {/* Connected indicator */}
            <div className={cn(
              'absolute -bottom-0.5 -right-0.5 rounded-full bg-green-500 border border-background',
              size === 'sm' && 'w-2 h-2',
              size === 'md' && 'w-2.5 h-2.5',
              size === 'lg' && 'w-3 h-3'
            )}></div>
          </motion.div>
        ))}
        
        {/* Remaining count indicator */}
        {remainingCount > 0 && (
          <div className={cn(
            'rounded-full bg-muted border-2 border-background flex items-center justify-center font-medium text-muted-foreground',
            size === 'sm' && 'w-5 h-5 text-xs',
            size === 'md' && 'w-6 h-6 text-xs',
            size === 'lg' && 'w-8 h-8 text-sm'
          )}>
            +{remainingCount}
          </div>
        )}
      </div>
      
      {/* Count text */}
      {showCount && (
        <span className={cn(
          'text-muted-foreground font-medium',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {connectedIntegrations.length} connected
        </span>
      )}
    </div>
  );
}