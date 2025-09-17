
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface AnalyticsData {
  members: {
    total: number;
    growth: number;
    active: number;
    newThisWeek: number;
  };
  engagement: {
    posts: number;
    comments: number;
    likes: number;
    shares: number;
  };
  activity: {
    dailyActive: number[];
    weeklyActive: number[];
    monthlyActive: number[];
  };
  topContent: {
    posts: Array<{ id: string; title: string; engagement: number }>;
    members: Array<{ id: string; name: string; contributions: number }>;
  };
}

interface CommunityAnalyticsDashboardProps {
  communityId: string;
  isAdmin: boolean;
}

export function CommunityAnalyticsDashboard({ communityId, isAdmin }: CommunityAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'members' | 'engagement' | 'activity'>('members');

  // Mock data - in real implementation, fetch from API
  const analyticsData: AnalyticsData = {
    members: {
      total: 1247,
      growth: 12.5,
      active: 892,
      newThisWeek: 34
    },
    engagement: {
      posts: 156,
      comments: 428,
      likes: 1203,
      shares: 89
    },
    activity: {
      dailyActive: [45, 52, 38, 61, 47, 55, 43],
      weeklyActive: [234, 267, 198, 289, 245, 278, 256],
      monthlyActive: [892, 934, 876, 945, 912, 967, 934, 998, 945, 1023, 987, 1047]
    },
    topContent: {
      posts: [
        { id: '1', title: 'Welcome to our community!', engagement: 95 },
        { id: '2', title: 'Monthly challenge results', engagement: 87 },
        { id: '3', title: 'New feature announcement', engagement: 72 },
      ],
      members: [
        { id: '1', name: 'Alice Johnson', contributions: 42 },
        { id: '2', name: 'Bob Smith', contributions: 38 },
        { id: '3', name: 'Carol Davis', contributions: 29 },
      ]
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">Only community administrators can view analytics.</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon }: {
    title: string;
    value: string | number;
    change?: number;
    icon: string;
  }) => (
    <div className="bg-card border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center text-sm font-medium',
            change >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            <span className="mr-1">{change >= 0 ? '↗' : '↘'}</span>
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, color = 'blue' }: { data: number[]; color?: string }) => {
    const max = Math.max(...data);
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };

    return (
      <div className="flex items-end gap-2 h-32">
        {data.map((value, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ delay: index * 0.1 }}
            className={cn('flex-1 rounded-t', colorClasses[color as keyof typeof colorClasses])}
            style={{ minHeight: '4px' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Analytics</h2>
          <p className="text-muted-foreground">Insights and metrics for your community</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Members"
          value={analyticsData.members.total}
          change={analyticsData.members.growth}
          icon="👥"
        />
        <MetricCard
          title="Active Members"
          value={analyticsData.members.active}
          icon="🟢"
        />
        <MetricCard
          title="New This Week"
          value={analyticsData.members.newThisWeek}
          icon="🆕"
        />
        <MetricCard
          title="Total Posts"
          value={analyticsData.engagement.posts}
          icon="📝"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Member Growth</h3>
          <SimpleChart data={analyticsData.activity.monthlyActive} color="blue" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Daily Activity</h3>
          <SimpleChart data={analyticsData.activity.dailyActive} color="green" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Engagement Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.engagement.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analyticsData.engagement.comments}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{analyticsData.engagement.likes}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.engagement.shares}</div>
            <div className="text-sm text-muted-foreground">Shares</div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Top Posts</h3>
          <div className="space-y-3">
            {analyticsData.topContent.posts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="font-medium">{post.title}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {post.engagement} interactions
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {analyticsData.topContent.members.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-sm flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.contributions} contributions
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            📊 Export CSV
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
            📈 Generate Report
          </button>
          <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/10 rounded-lg transition-colors">
            📱 Schedule Email
          </button>
        </div>
      </div>
    </div>
  );
}
