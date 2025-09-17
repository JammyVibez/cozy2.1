
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';

interface ModerationAction {
  id: string;
  type: 'warning' | 'mute' | 'ban' | 'delete_content';
  target: 'user' | 'post' | 'comment';
  targetId: string;
  moderator: string;
  reason: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface ModerationRule {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'spam' | 'toxicity' | 'custom';
  enabled: boolean;
  action: 'warn' | 'delete' | 'review';
  config: Record<string, any>;
}

interface CommunityModerationToolsProps {
  communityId: string;
  userRole: 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

export function CommunityModerationTools({ communityId, userRole }: CommunityModerationToolsProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'rules' | 'actions' | 'members'>('reports');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const { showToast } = useToast();

  if (!['ADMIN', 'MODERATOR'].includes(userRole)) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🛡️</div>
        <h3 className="text-lg font-medium mb-2">Moderation Access Required</h3>
        <p className="text-muted-foreground">Only moderators and administrators can access these tools.</p>
      </div>
    );
  }

  // Mock data
  const reports = [
    {
      id: '1',
      type: 'inappropriate_content',
      reporter: 'user123',
      target: 'post456',
      reason: 'Contains offensive language',
      status: 'pending',
      timestamp: '2024-01-15T10:30:00Z',
      severity: 'medium' as const
    },
    {
      id: '2',
      type: 'spam',
      reporter: 'user789',
      target: 'user101',
      reason: 'Posting repetitive promotional content',
      status: 'under_review',
      timestamp: '2024-01-15T09:15:00Z',
      severity: 'high' as const
    }
  ];

  const moderationRules: ModerationRule[] = [
    {
      id: 'keyword-filter',
      name: 'Keyword Filter',
      description: 'Automatically detect and filter inappropriate keywords',
      type: 'keyword',
      enabled: true,
      action: 'delete',
      config: { keywords: ['spam', 'inappropriate'], caseSensitive: false }
    },
    {
      id: 'spam-detector',
      name: 'Spam Detection',
      description: 'Identify and prevent spam content and behavior',
      type: 'spam',
      enabled: true,
      action: 'review',
      config: { threshold: 0.8, checkLinks: true }
    },
    {
      id: 'toxicity-filter',
      name: 'Toxicity Filter',
      description: 'Detect toxic language and behavior patterns',
      type: 'toxicity',
      enabled: false,
      action: 'warn',
      config: { severity: 'medium', autoEscalate: true }
    }
  ];

  const recentActions: ModerationAction[] = [
    {
      id: '1',
      type: 'warning',
      target: 'user',
      targetId: 'user123',
      moderator: 'admin',
      reason: 'Inappropriate language',
      timestamp: '2024-01-15T12:00:00Z',
      severity: 'medium'
    },
    {
      id: '2',
      type: 'delete_content',
      target: 'post',
      targetId: 'post456',
      moderator: 'moderator1',
      reason: 'Spam content',
      timestamp: '2024-01-15T11:30:00Z',
      severity: 'high'
    }
  ];

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss' | 'escalate') => {
    // Handle report action
    showToast({
      title: 'Action Taken',
      message: `Report ${action}ed successfully`,
      type: 'success'
    });
  };

  const toggleRule = (ruleId: string) => {
    // Toggle moderation rule
    showToast({
      title: 'Rule Updated',
      message: 'Moderation rule has been updated',
      type: 'success'
    });
  };

  const tabs = [
    { id: 'reports', label: 'Reports', icon: '⚠️' },
    { id: 'rules', label: 'Rules', icon: '📋' },
    { id: 'actions', label: 'Actions', icon: '🔨' },
    { id: 'members', label: 'Members', icon: '👥' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Moderation Tools</h2>
        <p className="text-muted-foreground">Manage community safety and enforce guidelines</p>
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

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {reports.map((report) => (
              <div key={report.id} className="bg-card border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      report.severity === 'high' ? 'bg-red-500' :
                      report.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    )} />
                    <div>
                      <h3 className="font-semibold capitalize">{report.type.replace('_', ' ')}</h3>
                      <p className="text-sm text-muted-foreground">
                        Reported by {report.reporter} • {new Date(report.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    report.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                    report.status === 'under_review' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                    'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  )}>
                    {report.status.replace('_', ' ')}
                  </div>
                </div>

                <p className="text-sm mb-4">{report.reason}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleReportAction(report.id, 'approve')}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    Take Action
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'dismiss')}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'escalate')}
                    className="px-3 py-1 border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Moderation Rules</h3>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Add New Rule
              </button>
            </div>

            {moderationRules.map((rule) => (
              <div key={rule.id} className="bg-card border rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        rule.enabled ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                      )}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Type: <strong>{rule.type}</strong></span>
                      <span>Action: <strong>{rule.action}</strong></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className="px-3 py-1 border rounded-lg text-sm hover:bg-muted transition-colors"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-sm transition-colors',
                        rule.enabled ? 'bg-red-500 text-white hover:bg-red-600' :
                        'bg-green-500 text-white hover:bg-green-600'
                      )}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'actions' && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Recent Moderation Actions</h3>
            
            {recentActions.map((action) => (
              <div key={action.id} className="bg-card border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      action.type === 'ban' ? 'bg-red-100 dark:bg-red-900' :
                      action.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-blue-100 dark:bg-blue-900'
                    )}>
                      {action.type === 'ban' ? '🚫' : 
                       action.type === 'warning' ? '⚠️' : 
                       action.type === 'mute' ? '🔇' : '🗑️'}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {action.type.replace('_', ' ')} • {action.target}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        By {action.moderator} • {new Date(action.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {action.reason}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-medium mb-2">Member Management</h3>
            <p className="text-muted-foreground mb-6">
              Advanced member management tools are being developed.
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
