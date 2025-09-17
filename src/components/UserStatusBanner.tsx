
'use client';

import { cn } from '@/lib/cn';
import { format } from 'date-fns';

interface UserStatusBannerProps {
  status: 'banned' | 'suspended' | 'deleted';
  reason?: string;
  bannedAt?: string;
  suspendedUntil?: string;
  className?: string;
}

export function UserStatusBanner({
  status,
  reason,
  bannedAt,
  suspendedUntil,
  className
}: UserStatusBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'banned':
        return {
          icon: '🚫',
          title: 'Account Banned',
          description: 'This account has been permanently banned from the platform.',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          accentColor: 'text-red-600 dark:text-red-400'
        };
      case 'suspended':
        return {
          icon: '⏸️',
          title: 'Account Suspended',
          description: 'This account is temporarily suspended.',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
          textColor: 'text-orange-800 dark:text-orange-200',
          accentColor: 'text-orange-600 dark:text-orange-400'
        };
      case 'deleted':
        return {
          icon: '🗑️',
          title: 'Account Deleted',
          description: 'This account has been deleted.',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          accentColor: 'text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          icon: '❌',
          title: 'Account Restricted',
          description: 'This account has restricted access.',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200',
          accentColor: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      'rounded-xl border p-6 shadow-sm',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="text-3xl" role="img" aria-label={config.title}>
          {config.icon}
        </div>
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className={cn('text-xl font-bold', config.textColor)}>
              {config.title}
            </h3>
            <p className={cn('text-sm', config.accentColor)}>
              {config.description}
            </p>
          </div>

          {reason && (
            <div className="space-y-1">
              <h4 className={cn('text-sm font-semibold', config.textColor)}>
                Reason:
              </h4>
              <p className={cn('text-sm', config.accentColor)}>
                {reason}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-xs">
            {bannedAt && (
              <div className={config.accentColor}>
                <span className="font-medium">Banned on:</span>{' '}
                {format(new Date(bannedAt), 'MMM d, yyyy')}
              </div>
            )}
            
            {suspendedUntil && (
              <div className={config.accentColor}>
                <span className="font-medium">Suspended until:</span>{' '}
                {format(new Date(suspendedUntil), 'MMM d, yyyy')}
              </div>
            )}
          </div>

          {status === 'suspended' && suspendedUntil && (
            <div className={cn('text-xs', config.accentColor)}>
              This account will be automatically reactivated on{' '}
              {format(new Date(suspendedUntil), 'MMMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
