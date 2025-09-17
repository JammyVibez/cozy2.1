
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';

interface Bot {
  id: string;
  name: string;
  description: string;
  author: string;
  category: string;
  permissions: string[];
  price: number;
  rating: number;
  installs: number;
  isInstalled: boolean;
  icon: string;
}

interface CommunityBotMarketplaceProps {
  communityId: string;
  installedBots: string[];
  onBotInstall: (botId: string, permissions: string[]) => void;
}

export function CommunityBotMarketplace({ 
  communityId, 
  installedBots = [], 
  onBotInstall 
}: CommunityBotMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Mock bots data
  const bots: Bot[] = [
    {
      id: 'welcome-bot',
      name: 'Welcome Bot',
      description: 'Automatically welcomes new members and provides community guidelines',
      author: 'Cozy Team',
      category: 'moderation',
      permissions: ['send_messages', 'read_members'],
      price: 0,
      rating: 4.8,
      installs: 15420,
      isInstalled: installedBots.includes('welcome-bot'),
      icon: '👋'
    },
    {
      id: 'music-bot',
      name: 'Music Bot',
      description: 'Play music in voice channels with queue management',
      author: 'AudioCorp',
      category: 'entertainment',
      permissions: ['connect_voice', 'speak', 'send_messages'],
      price: 5,
      rating: 4.6,
      installs: 8930,
      isInstalled: installedBots.includes('music-bot'),
      icon: '🎵'
    },
    {
      id: 'poll-bot',
      name: 'Poll Master',
      description: 'Create interactive polls and surveys for your community',
      author: 'PollTech',
      category: 'utility',
      permissions: ['send_messages', 'add_reactions'],
      price: 3,
      rating: 4.5,
      installs: 5670,
      isInstalled: installedBots.includes('poll-bot'),
      icon: '📊'
    },
    {
      id: 'auto-mod',
      name: 'Auto Moderator',
      description: 'Advanced moderation with spam detection and auto-bans',
      author: 'ModSafe',
      category: 'moderation',
      permissions: ['ban_members', 'delete_messages', 'manage_roles'],
      price: 10,
      rating: 4.9,
      installs: 12340,
      isInstalled: installedBots.includes('auto-mod'),
      icon: '🛡️'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Bots', count: bots.length },
    { id: 'moderation', name: 'Moderation', count: bots.filter(b => b.category === 'moderation').length },
    { id: 'entertainment', name: 'Entertainment', count: bots.filter(b => b.category === 'entertainment').length },
    { id: 'utility', name: 'Utility', count: bots.filter(b => b.category === 'utility').length }
  ];

  const filteredBots = selectedCategory === 'all' 
    ? bots 
    : bots.filter(bot => bot.category === selectedCategory);

  const installBotMutation = useMutation({
    mutationFn: async (bot: Bot) => {
      const response = await fetch(`/api/communities/${communityId}/bots/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          botId: bot.id, 
          permissions: bot.permissions 
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to install bot');
      }
      
      return response.json();
    },
    onSuccess: (data, bot) => {
      onBotInstall(bot.id, bot.permissions);
      setShowInstallModal(false);
      setSelectedBot(null);
      showToast({
        title: 'Bot Installed!',
        message: `${bot.name} has been added to your community`,
        type: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['community-bots', communityId] });
    },
    onError: (error: Error) => {
      showToast({
        title: 'Installation Failed',
        message: error.message,
        type: 'error'
      });
    },
  });

  const handleInstallBot = (bot: Bot) => {
    setSelectedBot(bot);
    setShowInstallModal(true);
  };

  const confirmInstall = () => {
    if (selectedBot) {
      installBotMutation.mutate(selectedBot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Bot Marketplace</h2>
        <p className="text-muted-foreground">
          Enhance your community with powerful bots and integrations
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <motion.div
            key={bot.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Bot Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{bot.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="text-sm text-muted-foreground">by {bot.author}</p>
                </div>
                {bot.isInstalled && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                    Installed
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {bot.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{bot.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📥</span>
                  <span>{bot.installs.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span>{bot.price === 0 ? 'Free' : `$${bot.price}`}</span>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <p className="text-xs font-medium mb-2">Required Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {bot.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className="bg-muted text-xs px-2 py-1 rounded"
                    >
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                  {bot.permissions.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{bot.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4">
              <div className="flex gap-2">
                <Button
                  size="small"
                  mode="secondary"
                  className="flex-1"
                  onPress={() => setSelectedBot(bot)}
                >
                  View Details
                </Button>
                {!bot.isInstalled && (
                  <Button
                    size="small"
                    className="flex-1"
                    onPress={() => handleInstallBot(bot)}
                    loading={installBotMutation.isPending && selectedBot?.id === bot.id}
                  >
                    Install
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Install Confirmation Modal */}
      <AnimatePresence>
        {showInstallModal && selectedBot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{selectedBot.icon}</div>
                <h3 className="text-xl font-bold mb-2">Install {selectedBot.name}?</h3>
                <p className="text-sm text-muted-foreground">
                  This bot will be granted the following permissions:
                </p>
              </div>

              <div className="space-y-2 mb-6">
                {selectedBot.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 p-2 bg-muted rounded"
                  >
                    <span className="text-green-500">✓</span>
                    <span className="text-sm capitalize">
                      {permission.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  mode="secondary"
                  className="flex-1"
                  onPress={() => setShowInstallModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onPress={confirmInstall}
                  loading={installBotMutation.isPending}
                >
                  Install Bot
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bot Details Modal */}
      <AnimatePresence>
        {selectedBot && !showInstallModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{selectedBot.icon}</div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedBot.name}</h2>
                      <p className="text-muted-foreground">by {selectedBot.author}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBot(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedBot.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">All Permissions</h3>
                    <div className="space-y-2">
                      {selectedBot.permissions.map((permission) => (
                        <div
                          key={permission}
                          className="flex items-center gap-2 p-2 bg-muted rounded"
                        >
                          <span className="text-blue-500">🔐</span>
                          <span className="text-sm capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{selectedBot.rating}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{selectedBot.installs.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Installs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {selectedBot.price === 0 ? 'Free' : `$${selectedBot.price}`}
                      </div>
                      <div className="text-sm text-muted-foreground">Price</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    mode="secondary"
                    className="flex-1"
                    onPress={() => setSelectedBot(null)}
                  >
                    Close
                  </Button>
                  {!selectedBot.isInstalled && (
                    <Button
                      className="flex-1"
                      onPress={() => handleInstallBot(selectedBot)}
                    >
                      Install Bot
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
