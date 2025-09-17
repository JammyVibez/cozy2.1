
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { Close } from '@/svg_components';
import { ReportCategory } from '@/types/definitions';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  targetTitle?: string;
}

const reportCategories: { value: ReportCategory; label: string; description: string }[] = [
  { value: 'SPAM', label: 'Spam', description: 'Repetitive or unsolicited content' },
  { value: 'HARASSMENT', label: 'Harassment', description: 'Bullying or intimidating behavior' },
  { value: 'HATE_SPEECH', label: 'Hate Speech', description: 'Content that attacks individuals or groups' },
  { value: 'VIOLENCE', label: 'Violence', description: 'Threats or depictions of violence' },
  { value: 'SEXUAL_CONTENT', label: 'Sexual Content', description: 'Inappropriate sexual material' },
  { value: 'COPYRIGHT', label: 'Copyright', description: 'Unauthorized use of copyrighted content' },
  { value: 'MISINFORMATION', label: 'Misinformation', description: 'False or misleading information' },
  { value: 'FAKE_ACCOUNT', label: 'Fake Account', description: 'Impersonation or fake profile' },
  { value: 'OTHER', label: 'Other', description: 'Other policy violations' }
];

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle }: ReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !reason.trim()) {
      showToast({
        title: 'Missing Information',
        message: 'Please select a category and provide a reason',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType,
          targetId,
          category: selectedCategory,
          reason: reason.trim(),
          description: description.trim() || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast({
          title: 'Report Submitted',
          message: 'Thank you for your report. We\'ll review it shortly.',
          type: 'success'
        });
        onClose();
        resetForm();
      } else {
        showToast({
          title: 'Error',
          message: data.error || 'Failed to submit report',
          type: 'error'
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to submit report. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setReason('');
    setDescription('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "relative w-full max-w-lg mx-4 bg-card border rounded-2xl shadow-xl",
            "max-h-[90vh] overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Report Content</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Report {targetType.toLowerCase()}{targetTitle && `: ${targetTitle}`}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <Close className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Why are you reporting this content?
              </label>
              <div className="space-y-2">
                {reportCategories.map((category) => (
                  <label
                    key={category.value}
                    className={cn(
                      "flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors",
                      selectedCategory === category.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value as ReportCategory)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm">{category.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a brief explanation..."
                className={cn(
                  "w-full px-3 py-2 border border-border rounded-xl",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "resize-none"
                )}
                rows={3}
                maxLength={500}
                required
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {reason.length}/500
              </div>
            </div>

            {/* Additional Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any additional context or details..."
                className={cn(
                  "w-full px-3 py-2 border border-border rounded-xl",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "resize-none"
                )}
                rows={3}
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {description.length}/1000
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedCategory || !reason.trim()}
                className={cn(
                  "flex-1 px-4 py-2 rounded-xl font-medium transition-colors",
                  "bg-red-500 text-white hover:bg-red-600",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
