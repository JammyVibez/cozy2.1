
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';
import { useToast } from '@/hooks/useToast';
import { StatusCreator } from './StatusCreator';

interface TrendingUser {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
  followers: number;
  isVerified: boolean;
}

interface ActiveCommunity {
  id: string;
  name: string;
  memberCount: number;
  onlineMembers: number;
  category: string;
  avatar: string | null;
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'join';
  user: {
    name: string;
    username: string;
    profilePhoto: string | null;
  };
  target?: {
    type: 'post' | 'community' | 'user';
    name: string;
  };
  timestamp: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
  category: 'social' | 'productivity' | 'developer' | 'gaming';
}

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<'trending' | 'communities' | 'activity' | 'integrations'>('trending');
  const [trendingUsers, setTrendingUsers] = useState<TrendingUser[]>([]);
  const [activeCommunities, setActiveCommunities] = useState<ActiveCommunity[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showStatusCreator, setShowStatusCreator] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTrendingUsers();
    fetchActiveCommunities();
    fetchRecentActivity();
    fetchIntegrations();

    const pusher = getPusherClient();
    const trendingChannel = pusher.subscribe('trending-users');
    const communitiesChannel = pusher.subscribe('active-communities');
    const activityChannel = pusher.subscribe('recent-activity');

    trendingChannel.bind('trending-update', (data: TrendingUser[]) => {
      setTrendingUsers(data);
    });

    communitiesChannel.bind('community-activity', (data: ActiveCommunity[]) => {
      setActiveCommunities(data);
    });

    activityChannel.bind('new-activity', (activity: RecentActivity) => {
      setRecentActivity(prev => [activity, ...prev.slice(0, 9)]);
    });

    return () => {
      trendingChannel.unbind_all();
      communitiesChannel.unbind_all();
      activityChannel.unbind_all();
      pusher.unsubscribe('trending-users');
      pusher.unsubscribe('active-communities');
      pusher.unsubscribe('recent-activity');
    };
  }, []);

  const fetchTrendingUsers = async () => {
    try {
      const response = await fetch('/api/discover/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching trending users:', error);
    }
  };

  const fetchActiveCommunities = async () => {
    try {
      const response = await fetch('/api/communities?active=true&limit=10');
      if (response.ok) {
        const data = await response.json();
        setActiveCommunities(data.communities || []);
      }
    } catch (error) {
      console.error('Error fetching active communities:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/activity/recent');
      if (response.ok) {
        const data = await response.json();
        setRecentActivity(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchIntegrations = async () => {
    const mockIntegrations: Integration[] = [
      {
        id: 'discord',
        name: 'Discord',
        description: 'Connect your Discord servers',
        icon: '🎮',
        isConnected: false,
        category: 'social'
      },
      {
        id: 'github',
        name: 'GitHub',
        description: 'Share your repositories',
        icon: '⚡',
        isConnected: true,
        category: 'developer'
      },
      {
        id: 'spotify',
        name: 'Spotify',
        description: 'Share what you\'re listening to',
        icon: '🎵',
        isConnected: false,
        category: 'social'
      },
      {
        id: 'notion',
        name: 'Notion',
        description: 'Embed your Notion pages',
        icon: '📝',
        isConnected: false,
        category: 'productivity'
      }
    ];
    setIntegrations(mockIntegrations);
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
        setIntegrations(prev => prev.map(i => 
          i.id === integrationId 
            ? { ...i, isConnected: !i.isConnected }
            : i
        ));

        showToast({
          title: integration.isConnected ? 'Disconnected' : 'Connected',
          message: `${integration.name} has been ${integration.isConnected ? 'disconnected' : 'connected'}`,
          type: 'success'
        });
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

  const tabs = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'communities', label: 'Communities', icon: '🏘️' },
    { id: 'activity', label: 'Activity', icon: '⚡' },
    { id: 'integrations', label: 'Apps', icon: '🔗' }
  ];

  return (
    <>
      <div className="hidden xl:block w-80 space-y-4">
        {/* Status Creator Button */}
        <div className="bg-card border rounded-xl p-4">
          <button
            onClick={() => setShowStatusCreator(true)}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            💭 Share Status
          </button>
        </div>

        {/* Main Sidebar */}
        <div className="bg-card border rounded-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b bg-muted/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-3 text-xs font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                <span className="text-xs">{tab.icon}</span>
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'trending' && (
                <motion.div
                  key="trending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {trendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm truncate">{user.name}</span>
                          {user.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          @{user.username} • {user.followers.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'communities' && (
                <motion.div
                  key="communities"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {activeCommunities.map((community) => (
                    <div key={community.id} className="p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {community.avatar ? (
                            <img src={community.avatar} alt={community.name} className="w-full h-full rounded object-cover" />
                          ) : (
                            community.name.charAt(0)
                          )}
                        </div>
                        <span className="font-medium text-sm truncate">{community.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{community.memberCount} members</span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{community.onlineMembers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2 p-2 hover:bg-muted rounded-lg transition-colors">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {activity.user.profilePhoto ? (
                          <img src={activity.user.profilePhoto} alt={activity.user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          activity.user.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs">
                          <span className="font-medium">{activity.user.name}</span>
                          {activity.type === 'post' && ' created a post'}
                          {activity.type === 'comment' && ' commented'}
                          {activity.type === 'like' && ' liked'}
                          {activity.type === 'follow' && ' followed'}
                          {activity.type === 'join' && ' joined'}
                          {activity.target && (
                            <>
                              {' '}
                              {activity.target.type === 'community' && 'the community '}
                              <span className="font-medium truncate">{activity.target.name}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{integration.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{integration.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{integration.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleIntegrationToggle(integration.id)}
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium transition-colors',
                          integration.isConnected
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                        )}
                      >
                        {integration.isConnected ? '✓' : '+'}
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <StatusCreator isOpen={showStatusCreator} onClose={() => setShowStatusCreator(false)} />
    </>
  );
}
