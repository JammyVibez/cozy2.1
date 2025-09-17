
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';
import { CommunityAnalyticsDashboard } from './CommunityAnalyticsDashboard';
import { CommunityModerationTools } from './CommunityModerationTools';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isActive: boolean;
  creator: {
    name: string;
    username: string;
  };
}

interface CommunityManagementDashboardProps {
  userRole: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  userId: string;
}

export function CommunityManagementDashboard({ userRole, userId }: CommunityManagementDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'moderation' | 'settings'>('overview');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [realtimeStats, setRealtimeStats] = useState({
    totalMembers: 0,
    activeCommunities: 0,
    totalMessages: 0,
    onlineUsers: 0
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Fetch communities
    fetchCommunities();
    
    // Setup real-time subscriptions
    const pusher = getPusherClient();
    const channel = pusher.subscribe('community-management');
    
    channel.bind('stats-update', (data: any) => {
      setRealtimeStats(data);
    });

    channel.bind('new-community', (data: Community) => {
      setCommunities(prev => [data, ...prev]);
      showToast({
        title: 'New Community Created',
        message: `${data.name} has been created`,
        type: 'success'
      });
    });

    channel.bind('community-update', (data: Community) => {
      setCommunities(prev => prev.map(c => c.id === data.id ? data : c));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('community-management');
    };
  }, [showToast]);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities');
      if (response.ok) {
        const data = await response.json();
        setCommunities(data.communities || []);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'moderation', label: 'Moderation', icon: '🛡️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  if (!['ADMIN', 'MODERATOR'].includes(userRole)) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">Only moderators and administrators can access management tools.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Management</h1>
        <p className="text-muted-foreground">Manage communities, analytics, and moderation</p>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeStats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeStats.activeCommunities}</div>
              <div className="text-sm text-muted-foreground">Active Communities</div>
            </div>
            <div className="text-2xl">🏘️</div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeStats.totalMessages.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
            </div>
            <div className="text-2xl">💬</div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{realtimeStats.onlineUsers}</div>
              <div className="text-sm text-muted-foreground">Online Now</div>
            </div>
            <div className="text-2xl">🟢</div>
          </div>
        </div>
      </div>

      {/* Community Selection */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Select Community</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((community) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunity(community.id)}
              className={cn(
                'p-4 border rounded-lg text-left transition-all duration-200',
                selectedCommunity === community.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{community.name}</h4>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  community.isActive ? 'bg-green-500' : 'bg-gray-400'
                )} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
              <div className="text-xs text-muted-foreground">
                {community.memberCount} members • {community.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Recent Communities</h3>
                <div className="space-y-3">
                  {communities.slice(0, 5).map((community) => (
                    <div key={community.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{community.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {community.memberCount} members
                        </div>
                      </div>
                      <div className={cn(
                        'px-2 py-1 rounded-full text-xs',
                        community.isActive 
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      )}>
                        {community.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Create New Community
                  </button>
                  <button className="w-full p-3 border rounded-lg hover:bg-muted transition-colors">
                    Bulk Member Management
                  </button>
                  <button className="w-full p-3 border rounded-lg hover:bg-muted transition-colors">
                    Export Analytics
                  </button>
                  <button className="w-full p-3 border rounded-lg hover:bg-muted transition-colors">
                    System Health Check
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && selectedCommunity && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CommunityAnalyticsDashboard
              communityId={selectedCommunity}
              isAdmin={userRole === 'ADMIN'}
            />
          </motion.div>
        )}

        {activeTab === 'moderation' && selectedCommunity && (
          <motion.div
            key="moderation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CommunityModerationTools
              communityId={selectedCommunity}
              userRole={userRole}
            />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium mb-2">Community Settings</h3>
            <p className="text-muted-foreground mb-6">
              Advanced settings and configuration options.
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Coming Soon
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
