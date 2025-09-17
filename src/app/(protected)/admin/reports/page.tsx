
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { GetReport, ReportCategory, ReportStatus } from '@/types/definitions';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<GetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'ALL'>('ALL');
  const [processingReport, setProcessingReport] = useState<string | null>(null);
  const { showToast } = useToast();

  const statusOptions = [
    { value: 'ALL', label: 'All Reports', color: 'bg-gray-100 text-gray-700' },
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
    { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-700' },
    { value: 'DISMISSED', label: 'Dismissed', color: 'bg-gray-100 text-gray-700' }
  ];

  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'SPAM', label: 'Spam' },
    { value: 'HARASSMENT', label: 'Harassment' },
    { value: 'HATE_SPEECH', label: 'Hate Speech' },
    { value: 'VIOLENCE', label: 'Violence' },
    { value: 'SEXUAL_CONTENT', label: 'Sexual Content' },
    { value: 'COPYRIGHT', label: 'Copyright' },
    { value: 'MISINFORMATION', label: 'Misinformation' },
    { value: 'FAKE_ACCOUNT', label: 'Fake Account' },
    { value: 'OTHER', label: 'Other' }
  ];

  const actionTypes = [
    { value: 'NO_ACTION', label: 'No Action Required' },
    { value: 'WARNING_ISSUED', label: 'Issue Warning' },
    { value: 'CONTENT_REMOVED', label: 'Remove Content' },
    { value: 'CONTENT_HIDDEN', label: 'Hide Content' },
    { value: 'USER_SUSPENDED', label: 'Suspend User (7 days)' },
    { value: 'USER_BANNED', label: 'Ban User' }
  ];

  useEffect(() => {
    fetchReports();
  }, [selectedStatus, selectedCategory]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);

      const response = await fetch(`/api/reports?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
      } else {
        showToast({
          title: 'Error',
          message: 'Failed to fetch reports',
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to fetch reports',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, status: ReportStatus, actionType?: string, actionReason?: string) => {
    setProcessingReport(reportId);

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          actionType,
          actionReason
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast({
          title: 'Success',
          message: 'Report updated successfully',
          type: 'success'
        });
        fetchReports();
      } else {
        showToast({
          title: 'Error',
          message: data.error || 'Failed to update report',
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to update report',
        type: 'error'
      });
    } finally {
      setProcessingReport(null);
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    const option = statusOptions.find(s => s.value === status);
    return option?.color || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Report Management</h1>
          <p className="text-muted-foreground">Review and moderate user reports</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => (
          <div key={status.value} className="bg-card border rounded-xl p-4">
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === status.value).length}
            </div>
            <div className="text-sm text-muted-foreground">{status.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ReportStatus | 'ALL')}
            className="px-3 py-2 border border-border rounded-lg"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ReportCategory | 'ALL')}
            className="px-3 py-2 border border-border rounded-lg"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
            <p className="text-muted-foreground">No reports match the current filters.</p>
          </div>
        ) : (
          reports.map((report) => (
            <motion.div
              key={report.id}
              className="bg-card border rounded-xl p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(report.status))}>
                    {report.status.replace('_', ' ')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {report.category} • {formatDate(report.createdAt)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {report.targetType}
                </div>
              </div>

              <div className="mb-4">
                <div className="font-medium mb-2">Reported by @{report.reporter.username}</div>
                <div className="text-sm mb-2"><strong>Reason:</strong> {report.reason}</div>
                {report.description && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Details:</strong> {report.description}
                  </div>
                )}
              </div>

              {report.targetData && (
                <div className="bg-muted/30 rounded-lg p-3 mb-4">
                  <div className="font-medium text-sm mb-1">Reported Content:</div>
                  <div className="text-sm">
                    {report.targetType === 'USER' 
                      ? `User: @${report.targetData.username}`
                      : report.targetData.content || 'Content unavailable'
                    }
                  </div>
                </div>
              )}

              {report.status === 'PENDING' && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleReportAction(report.id, 'UNDER_REVIEW')}
                    disabled={processingReport === report.id}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleReportAction(report.id, 'DISMISSED', 'NO_ACTION', 'Report dismissed after review')}
                    disabled={processingReport === report.id}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                  
                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleReportAction(report.id, 'RESOLVED', 'WARNING_ISSUED', 'User warned for policy violation')}
                      disabled={processingReport === report.id}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => handleReportAction(report.id, 'RESOLVED', 'CONTENT_REMOVED', 'Content removed for policy violation')}
                      disabled={processingReport === report.id}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleReportAction(report.id, 'RESOLVED', 'USER_SUSPENDED', 'User suspended for policy violation')}
                      disabled={processingReport === report.id}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              )}

              {report.moderatorAction && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <strong>Action Taken:</strong> {report.moderatorAction.actionType.replace('_', ' ')} by @{report.moderatorAction.moderator.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Reason:</strong> {report.moderatorAction.reason}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(report.moderatorAction.actionDate)}
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
