'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { cn } from '@/lib/cn';
import { TwoPeople, Heart, Comment, View, DeviceLaptop } from '@/svg_components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  followers: {
    count: number;
    growth: number;
    chartData: number[];
  };
  engagement: {
    rate: number;
    likes: number;
    comments: number;
    shares: number;
    chartData: number[];
  };
  reach: {
    total: number;
    growth: number;
    chartData: number[];
  };
  topPosts: {
    id: string;
    content: string;
    likes: number;
    comments: number;
    reach: number;
  }[];
  demographics: {
    ageGroups: { label: string; count: number }[];
    locations: { country: string; count: number }[];
  };
}

export function CreatorDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/creator/analytics?range=${timeRange}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <p>Unable to load analytics data</p>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }) => (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'p-3 rounded-lg',
          color === 'blue' && 'bg-blue-100 text-blue-600',
          color === 'green' && 'bg-green-100 text-green-600',
          color === 'purple' && 'bg-purple-100 text-purple-600',
          color === 'orange' && 'bg-orange-100 text-orange-600'
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {growth !== undefined && (
          <span className={cn(
            'text-sm font-medium',
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {growth >= 0 ? '+' : ''}{growth}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );

  const followerChartData = {
    labels: ['7 days ago', '6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
    datasets: [
      {
        label: 'Followers',
        data: analyticsData.followers.chartData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const engagementChartData = {
    labels: ['Likes', 'Comments', 'Shares'],
    datasets: [
      {
        data: [
          analyticsData.engagement.likes,
          analyticsData.engagement.comments,
          analyticsData.engagement.shares,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Track your content performance and audience growth
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex bg-muted rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 rounded-md transition-all duration-200 font-medium',
                timeRange === range
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'hover:bg-white/50 dark:hover:bg-gray-600'
              )}
            >
              {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Followers"
          value={analyticsData.followers.count}
          growth={analyticsData.followers.growth}
          icon={TwoPeople}
          color="blue"
        />
        <StatCard
          title="Engagement Rate"
          value={`${analyticsData.engagement.rate}%`}
          icon={Heart}
          color="green"
        />
        <StatCard
          title="Total Reach"
          value={analyticsData.reach.total}
          growth={analyticsData.reach.growth}
          icon={View}
          color="purple"
        />
        <StatCard
          title="Avg. Comments"
          value={Math.round(analyticsData.engagement.comments / 30)}
          icon={Comment}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follower Growth */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Follower Growth</h3>
          <div className="h-64">
            <Line data={followerChartData} options={chartOptions} />
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Breakdown</h3>
          <div className="h-64">
            <Doughnut 
              data={engagementChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {analyticsData.topPosts.map((post, index) => (
            <div key={post.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{post.content}</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <Comment className="w-4 h-4" />
                  {post.comments}
                </span>
                <span className="flex items-center gap-1">
                  <View className="w-4 h-4" />
                  {post.reach}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Audience by Age</h3>
          <div className="space-y-3">
            {analyticsData.demographics.ageGroups.map((group) => (
              <div key={group.label} className="flex items-center justify-between">
                <span className="text-sm">{group.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ 
                        width: `${(group.count / Math.max(...analyticsData.demographics.ageGroups.map(g => g.count))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {group.count}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
          <div className="space-y-3">
            {analyticsData.demographics.locations.slice(0, 5).map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <span className="text-sm">{location.country}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary"
                      style={{ 
                        width: `${(location.count / Math.max(...analyticsData.demographics.locations.map(l => l.count))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {location.count}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}