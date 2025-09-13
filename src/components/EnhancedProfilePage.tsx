'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import Button from '@/components/ui/Button';
import { QuickThemeToggle } from '@/components/AdvancedThemeSwitch';
import { 
  TwoPeople, 
  Heart, 
  Comment, 
  GridFeedCards,
  DeviceLaptop,
  Send,
  More,
  ActionsPlus,
  Calendar,
  WorldNet
} from '@/svg_components';
import { CosmeticProvider } from '@/components/cosmetics/CosmeticProvider';
import { CosmeticBanner } from '@/components/cosmetics/CosmeticBanner';
import { CosmeticAvatar } from '@/components/cosmetics/CosmeticAvatar';
import { CosmeticNameplate } from '@/components/cosmetics/CosmeticNameplate';
import { ThemeInjector } from '@/components/cosmetics/ThemeInjector';

interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  likes: number;
}

interface ProfileUser {
  id: string;
  name: string;
  username: string;
  bio?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  verified?: boolean;
  joinedAt: string;
  location?: string;
  website?: string;
  isFollowing?: boolean;
}

interface EnhancedProfilePageProps {
  user: ProfileUser;
  stats: ProfileStats;
  isOwnProfile: boolean;
}

export function EnhancedProfilePage({ user, stats, isOwnProfile }: EnhancedProfilePageProps) {
  const { data: session } = useSession();
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);

  const handleFollow = async () => {
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      await fetch(`/api/users/${user.id}/following`, { method });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const startChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: user.id }),
      });
      const data = await response.json();
      // Chat will be handled by the RealtimeChat component
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <CosmeticProvider userId={user.id}>
      <ThemeInjector />
      <div 
        className={cn(
          "min-h-screen transition-all duration-200",
          "bg-gradient-to-b from-background/50 to-muted/30",
          `theme-${variant}-profile`,
          actualMode
        )}
        data-theme={variant}
      >
        {/* Cover Photo Section */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <CosmeticBanner 
            className="w-full h-full"
            fallbackBanner={user.coverPhoto || undefined}
          />
          {!user.coverPhoto && (
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600" />
          )}
          
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          
          {/* Theme toggle */}
          <div className="absolute top-4 right-4">
            <QuickThemeToggle />
          </div>
        </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
          {/* Profile Photo */}
          <div className="relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-white dark:border-gray-800 shadow-xl">
              {user.profilePhoto ? (
                <CosmeticAvatar
                  src={user.profilePhoto}
                  alt={user.name}
                  size="xl"
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {isOwnProfile ? (
              <>
                <Link href="/edit-profile">
                  <Button
                    mode="secondary"
                    className="flex items-center gap-2 px-6 py-3 font-semibold border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600"
                  >
                    <More className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 font-semibold shadow-lg"
                >
                  <ActionsPlus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </>
            ) : (
              <>
                <Button
                  onPress={startChat}
                  mode="secondary"
                  className="flex items-center gap-2 px-6 py-3 font-semibold border-2 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600"
                >
                  <Send className="w-4 h-4" />
                  Message
                </Button>
                <Button
                  onPress={handleFollow}
                  className={cn(
                    'px-6 py-3 font-semibold shadow-lg transition-all duration-200',
                    isFollowing
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                  )}
                >
                  <TwoPeople className="w-4 h-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl text-gray-900 dark:text-white">
                <CosmeticNameplate username={user.name} />
              </h1>
              {user.verified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">@{user.username}</p>
          </div>

          {user.bio && (
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
              {user.bio}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center gap-1">
                <WorldNet className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <DeviceLaptop className="w-4 h-4" />
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 dark:text-orange-400 hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <Link href={`/${user.username}/posts`} className="group">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {stats.posts.toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Posts</div>
              </div>
            </Link>
            <Link href={`/${user.username}/followers`} className="group">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {stats.followers.toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Followers</div>
              </div>
            </Link>
            <Link href={`/${user.username}/following`} className="group">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {stats.following.toLocaleString()}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Following</div>
              </div>
            </Link>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.likes.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="px-6">
          <div className="flex space-x-8">
            {(['posts', 'media', 'likes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'py-4 px-2 border-b-2 transition-colors font-medium capitalize',
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {/* Posts will be loaded here */}
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Posts will appear here
              </div>
            </div>
          )}
          
          {activeTab === 'media' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Media grid will be loaded here */}
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                Media posts will appear here
              </div>
            </div>
          )}
          
          {activeTab === 'likes' && (
            <div className="space-y-6">
              {/* Liked posts will be loaded here */}
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Liked posts will appear here
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
    </CosmeticProvider>
  );
}