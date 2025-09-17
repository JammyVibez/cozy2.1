'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isConnected: boolean;
  connectedAt?: string;
  username?: string;
  status: string;
}

interface IntegrationsManagementProps {
  userId: string;
}

export function IntegrationsManagement({ userId }: IntegrationsManagementProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data.integrations || []);
      }
    } catch (error) {
      console.error('Error fetching integrations:', error);
      showToast({
        title: 'Error',
        message: 'Failed to load integrations',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationToggle = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    try {
      const response = await fetch('/api/integrations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId, connect: !integration.isConnected })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIntegrations(prev => prev.map(i => 
            i.id === integrationId 
              ? { ...i, isConnected: !i.isConnected, username: result.integration?.username }
              : i
          ));

          showToast({
            title: integration.isConnected ? 'Disconnected' : 'Connected',
            message: `${integration.name} has been ${integration.isConnected ? 'disconnected' : 'connected'}`,
            type: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling integration:', error);
      showToast({
        title: 'Error',
        message: 'Failed to update integration',
        type: 'error'
      });
    }
  };

  const categories = ['all', 'social', 'developer', 'finance', 'entertainment', 'gaming', 'professional'];
  const filteredIntegrations = filter === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.filter(i => i.isConnected).length}</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🔗</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 font-bold">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.round((integrations.filter(i => i.isConnected).length / integrations.length) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Connected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.icon}</div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <span className={cn(
                        'inline-block px-2 py-1 rounded-full text-xs font-medium',
                        integration.category === 'social' && 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
                        integration.category === 'developer' && 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
                        integration.category === 'finance' && 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
                        integration.category === 'entertainment' && 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
                        integration.category === 'gaming' && 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
                        integration.category === 'professional' && 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      )}>
                        {integration.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    integration.isConnected ? 'bg-green-500' : 'bg-gray-300'
                  )}></div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                
                {integration.isConnected && integration.username && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">Connected as</div>
                    <div className="font-medium">{integration.username}</div>
                  </div>
                )}
                
                <button
                  onClick={() => handleIntegrationToggle(integration.id)}
                  className={cn(
                    'w-full py-2 px-4 rounded-lg font-medium transition-colors',
                    integration.isConnected
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {integration.isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-lg font-medium mb-2">No Integrations Found</h3>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
}