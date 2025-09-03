'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Search, TwoPeople, Heart, GridFeedCards } from '@/svg_components';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

interface TrendingHashtag {
  tag: string;
  count: number;
  growth: number;
}

interface TrendingPost {
  id: string;
  content: string;
  user: {
    username: string;
    name: string;
    profilePhoto: string | null;
    verified?: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  media?: {
    url: string;
    type: 'image' | 'video';
  };
}

interface SuggestedUser {
  id: string;
  username: string;
  name: string;
  bio: string;
  profilePhoto: string | null;
  verified?: boolean;
  followers: number;
  mutualFollows: number;
}

export function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'people' | 'hashtags'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscoverData();
  }, [activeTab]);

  const fetchDiscoverData = async () => {
    setLoading(true);
    try {
      const endpoint = `/api/discover/${activeTab}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      
      switch (activeTab) {
        case 'trending':
          setTrendingPosts(data.posts || []);
          break;
        case 'hashtags':
          setTrendingHashtags(data.hashtags || []);
          break;
        case 'people':
          setSuggestedUsers(data.users || []);
          break;
      }
    } catch (error) {
      console.error('Error fetching discover data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
      const data = await response.json();
      
      switch (activeTab) {
        case 'trending':
          setTrendingPosts(data.posts || []);
          break;
        case 'hashtags':
          setTrendingHashtags(data.hashtags || []);
          break;
        case 'people':
          setSuggestedUsers(data.users || []);
          break;
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const followUser = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}/following`, {
        method: 'POST',
      });
      // Update local state
      setSuggestedUsers(users => 
        users.map(user => 
          user.id === userId 
            ? { ...user, followers: user.followers + 1 }
            : user
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-muted-foreground">
          Find trending content, discover new people, and explore popular topics
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <TextInput
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          className="pl-10 w-full"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          {(['trending', 'people', 'hashtags'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-2 rounded-md transition-all duration-200 font-medium capitalize',
                activeTab === tab
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-gray-600'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Trending Posts */}
            {activeTab === 'trending' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group block"
                  >
                    <div className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                      {post.media && (
                        <div className="aspect-square relative">
                          <Image
                            src={post.media.url}
                            alt="Post media"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={post.user.profilePhoto || '/default-avatar.png'}
                            alt={post.user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {post.user.name}
                              {post.user.verified && (
                                <span className="ml-1 text-blue-500">✓</span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              @{post.user.username}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.stats.likes}
                          </span>
                          <span>{post.stats.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Trending Hashtags */}
            {activeTab === 'hashtags' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingHashtags.map((hashtag, index) => (
                  <Link
                    key={hashtag.tag}
                    href={`/posts/hashtag/${hashtag.tag.slice(1)}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-primary">
                          #{hashtag.tag}
                        </span>
                        <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {hashtag.count.toLocaleString()} posts
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          hashtag.growth > 0 ? 'bg-green-500' : 'bg-red-500'
                        )} />
                        <span className={cn(
                          'text-sm font-medium',
                          hashtag.growth > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {hashtag.growth > 0 ? '+' : ''}{hashtag.growth}% this week
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Suggested People */}
            {activeTab === 'people' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-card rounded-lg border p-6 text-center space-y-4"
                  >
                    <Link href={`/${user.username}`} className="block">
                      <Image
                        src={user.profilePhoto || '/default-avatar.png'}
                        alt={user.name}
                        width={80}
                        height={80}
                        className="rounded-full mx-auto"
                      />
                    </Link>
                    <div className="space-y-2">
                      <Link href={`/${user.username}`} className="block">
                        <h3 className="font-semibold">
                          {user.name}
                          {user.verified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </Link>
                      <p className="text-sm line-clamp-2">{user.bio}</p>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span>{user.followers.toLocaleString()} followers</span>
                        {user.mutualFollows > 0 && (
                          <span>{user.mutualFollows} mutual</span>
                        )}
                      </div>
                    </div>
                    <Button
                      onPress={() => followUser(user.id)}
                      className="w-full"
                    >
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}