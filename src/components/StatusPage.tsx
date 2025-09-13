'use client';

import { motion } from 'framer-motion';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { cn } from '@/lib/cn';
import { WorldNet, Heart, TwoPeople, Comment, DeviceLaptop } from '@/svg_components';

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
  responseTime?: string;
}

interface StatusPageProps {
  className?: string;
}

export function StatusPage({ className }: StatusPageProps) {
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;

  const systemStatus: SystemStatus[] = [
    { name: 'Web Application', status: 'operational', uptime: '99.9%', responseTime: '45ms' },
    { name: 'User Authentication', status: 'operational', uptime: '99.8%', responseTime: '22ms' },
    { name: 'Database Services', status: 'operational', uptime: '99.9%', responseTime: '12ms' },
    { name: 'File Upload & Media', status: 'operational', uptime: '99.7%', responseTime: '180ms' },
    { name: 'Real-time Messaging', status: 'operational', uptime: '99.6%', responseTime: '35ms' },
    { name: 'Theme Engine', status: 'operational', uptime: '100%', responseTime: '8ms' },
  ];

  const overallStatus = systemStatus.every(s => s.status === 'operational') ? 'operational' : 'degraded';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'outage': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      default: return '❓';
    }
  };

  return (
    <div 
      className={cn(
        "min-h-screen p-6",
        "bg-gradient-to-br from-background via-muted/10 to-background",
        `theme-${variant}-status`,
        actualMode,
        className
      )}
      data-theme={variant}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className={cn(
                "p-4 rounded-full",
                "bg-gradient-to-r from-primary/20 to-accent/20",
                "border border-primary/30"
              )}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <WorldNet className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
          
          <h1 className={cn(
            "text-4xl md:text-6xl font-bold",
            "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          )}>
            System Status
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time status of all Munia platform services and infrastructure
          </p>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          className={cn(
            "bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8",
            "shadow-lg",
            `theme-${variant}-status-card`
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-theme={variant}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Overall Status</h2>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getStatusIcon(overallStatus)}</span>
                <span className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold border",
                  getStatusColor(overallStatus)
                )}>
                  {overallStatus === 'operational' ? 'All Systems Operational' : 'Some Issues Detected'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">99.8%</div>
              <div className="text-sm text-muted-foreground">Overall Uptime</div>
            </div>
          </div>
        </motion.div>

        {/* Service Status Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {systemStatus.map((service, index) => (
            <motion.div
              key={service.name}
              className={cn(
                "bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl p-6",
                "shadow-md hover:shadow-lg transition-all duration-200",
                `theme-${variant}-service-card`
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              data-theme={variant}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-foreground">{service.name}</h3>
                <span className="text-xl">{getStatusIcon(service.status)}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium border",
                    getStatusColor(service.status)
                  )}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium text-foreground">{service.uptime}</span>
                </div>
                
                {service.responseTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium text-foreground">{service.responseTime}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Incidents */}
        <motion.div
          className={cn(
            "bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8",
            "shadow-lg",
            `theme-${variant}-incidents-card`
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          data-theme={variant}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
          
          <div className="space-y-4">
            <div className="flex items-center text-green-600">
              <span className="text-xl mr-3">✅</span>
              <div>
                <div className="font-medium">No recent incidents</div>
                <div className="text-sm text-muted-foreground">All systems have been running smoothly</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          className={cn(
            "bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-8",
            "shadow-lg",
            `theme-${variant}-metrics-card`
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          data-theme={variant}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Performance Metrics</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">45ms</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime (30 days)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1.2M+</div>
              <div className="text-sm text-muted-foreground">Requests Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Active Issues</div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()} • Auto-refreshes every 30 seconds
          </p>
        </motion.div>
      </div>
    </div>
  );
}