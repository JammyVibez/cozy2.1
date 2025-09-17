
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';

interface Bot {
  id: string;
  name: string;
  description: string;
  developer: string;
  category: string;
  version: string;
  price: number;
  rating: number;
  downloads: number;
  permissions: string[];
  screenshots: string[];
  features: string[];
  verified: boolean;
}

interface CommunityBotMarketplaceProps {
  communityId: string;
  installedBots: string[];
  onBotInstall: (botId: string, permissions: string[]) => void;
}

const bots: Bot[] = [
  {
    id: 'moderation-pro',
    name: 'Moderation Pro',
    description: 'Advanced moderation tools with auto-moderation, spam detection, and user management',
    developer: 'ModTools Inc',
    category: 'Moderation',
    version: '2.1.0',
    price: 0,
    rating: 4.8,
    downloads: 15420,
    permissions: ['READ_MESSAGES', 'DELETE_MESSAGES', 'BAN_MEMBERS', 'KICK_MEMBERS'],
    screenshots: [],
    features: ['Auto Spam Detection', 'Custom Word Filters', 'Warning System', 'Mod Logs'],
    verified: true
  },
  {
    id: 'welcome-bot',
    name: 'Welcome Bot',
    description: 'Greet new members with custom messages, role assignments, and onboarding flows',
    developer: 'Community Tools',
    category: 'Utility',
    version: '1.5.2',
    price: 0,
    rating: 4.6,
    downloads: 8930,
    permissions: ['READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_ROLES'],
    screenshots: [],
    features: ['Custom Welcome Messages', 'Auto Role Assignment', 'Onboarding Flows', 'Member Count'],
    verified: true
  },
  {
    id: 'poll-master',
    name: 'Poll Master',
    description: 'Create interactive polls, surveys, and voting systems with advanced analytics',
    developer: 'VoteWare',
    category: 'Engagement',
    version: '3.0.1',
    price: 5,
    rating: 4.9,
    downloads: 6240,
    permissions: ['READ_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS'],
    screenshots: [],
    features: ['Multi-Choice Polls', 'Anonymous Voting', 'Real-time Results', 'Export Data'],
    verified: true
  },
  {
    id: 'event-scheduler',
    name: 'Event Scheduler',
    description: 'Schedule events, send reminders, and manage RSVPs with calendar integration',
    developer: 'EventBot Co',
    category: 'Events',
    version: '1.8.0',
    price: 3,
    rating: 4.7,
    downloads: 4680,
    permissions: ['READ_MESSAGES', 'SEND_MESSAGES', 'MANAGE_EVENTS'],
    screenshots: [],
    features: ['Event Scheduling', 'RSVP Management', 'Reminders', 'Calendar Sync'],
    verified: false
  },
  {
    id: 'music-player',
    name: 'Music Player Pro',
    description: 'High-quality music streaming with playlist management and queue controls',
    developer: 'AudioStream',
    category: 'Entertainment',
    version: '4.2.1',
    price: 7,
    rating: 4.5,
    downloads: 12350,
    permissions: ['CONNECT_VOICE', 'SPEAK_VOICE', 'READ_MESSAGES'],
    screenshots: [],
    features: ['High Quality Audio', 'Playlist Support', 'Queue Management', 'Now Playing'],
    verified: true
  },
  {
    id: 'trivia-bot',
    name: 'Trivia Master',
    description: 'Interactive trivia games with custom questions and leaderboards',
    developer: 'GameBots',
    category: 'Games',
    version: '2.3.0',
    price: 2,
    rating: 4.4,
    downloads: 3450,
    permissions: ['READ_MESSAGES', 'SEND_MESSAGES', 'ADD_REACTIONS'],
    screenshots: [],
    features: ['Custom Questions', 'Multiple Categories', 'Leaderboards', 'Daily Challenges'],
    verified: false
  }
];

const categories = ['All', 'Moderation', 'Utility', 'Engagement', 'Events', 'Entertainment', 'Games'];

function BotCard({ bot, isInstalled, onInstall }: {
  bot: Bot;
  isInstalled: boolean;
  onInstall: (botId: string, permissions: string[]) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  
  const handleInstall = () => {
    if (bot.permissions.length > 0) {
      setShowPermissions(true);
    } else {
      onInstall(bot.id, []);
    }
  };

  const confirmInstall = () => {
    onInstall(bot.id, bot.permissions);
    setShowPermissions(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              {bot.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{bot.name}</h3>
                {bot.verified && (
                  <span className="text-blue-500" title="Verified Bot">✓</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{bot.developer} • v{bot.version}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{bot.rating}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {bot.downloads.toLocaleString()} downloads
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>

        <div className="flex flex-wrap gap-2">
          {bot.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="px-2 py-1 bg-muted rounded-md text-xs font-medium"
            >
              {feature}
            </span>
          ))}
          {bot.features.length > 3 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{bot.features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {bot.price === 0 ? 'Free' : `${bot.price} coins`}
            </span>
            <button
              onClick={() => setShowDetails(true)}
              className="text-sm text-primary hover:underline"
            >
              View Details
            </button>
          </div>
          
          <button
            onClick={handleInstall}
            disabled={isInstalled}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isInstalled
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {isInstalled ? '✓ Installed' : 'Install'}
          </button>
        </div>
      </motion.div>

      {/* Bot Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {bot.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{bot.name}</h2>
                        {bot.verified && <span className="text-blue-500 text-xl">✓</span>}
                      </div>
                      <p className="text-muted-foreground">{bot.developer}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{bot.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{bot.downloads.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">v{bot.version}</div>
                    <div className="text-sm text-muted-foreground">Version</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{bot.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bot.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {bot.permissions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Required Permissions</h3>
                    <div className="space-y-2">
                      {bot.permissions.map((permission) => (
                        <div key={permission} className="bg-muted p-2 rounded-lg">
                          <span className="font-mono text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleInstall}
                    disabled={isInstalled}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                      isInstalled
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {isInstalled ? '✓ Installed' : `Install ${bot.price === 0 ? 'Free' : `for ${bot.price} coins`}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permissions Confirmation Modal */}
      <AnimatePresence>
        {showPermissions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Confirm Bot Installation</h3>
              <p className="text-muted-foreground mb-4">
                <strong>{bot.name}</strong> is requesting the following permissions:
              </p>
              <div className="space-y-2 mb-6">
                {bot.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-orange-500">⚠️</span>
                    <span className="font-mono text-sm">{permission}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPermissions(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmInstall}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Grant & Install
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function CommunityBotMarketplace({ communityId, installedBots, onBotInstall }: CommunityBotMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price'>('popularity');
  const { showToast } = useToast();

  const filteredBots = bots
    .filter(bot => selectedCategory === 'All' || bot.category === selectedCategory)
    .filter(bot => 
      searchQuery === '' || 
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.price - b.price;
    });

  const handleBotInstall = (botId: string, permissions: string[]) => {
    onBotInstall(botId, permissions);
    showToast({
      title: 'Bot Installed!',
      message: 'The bot has been successfully installed to your community.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bot Marketplace</h2>
          <p className="text-muted-foreground">Enhance your community with powerful bots</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search bots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg bg-background"
        />
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted-foreground/10'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            isInstalled={installedBots.includes(bot.id)}
            onInstall={handleBotInstall}
          />
        ))}
      </div>

      {filteredBots.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-medium mb-2">No Bots Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
