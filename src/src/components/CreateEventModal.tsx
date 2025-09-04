'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';
import { Close } from '@/svg_components';

interface CreateEventModalProps {
  communityId: string;
  onClose: () => void;
}

const eventTypes = [
  { value: 'DISCUSSION', label: 'Discussion', emoji: '💬', description: 'Community discussion or Q&A' },
  { value: 'AMA', label: 'Ask Me Anything', emoji: '❓', description: 'Interactive Q&A session' },
  { value: 'TOURNAMENT', label: 'Tournament', emoji: '🏆', description: 'Gaming or competition event' },
  { value: 'WORKSHOP', label: 'Workshop', emoji: '🛠️', description: 'Educational or skill-building session' },
  { value: 'SOCIAL', label: 'Social Event', emoji: '🎉', description: 'Casual community gathering' },
  { value: 'OTHER', label: 'Other', emoji: '📝', description: 'Custom event type' },
];

export function CreateEventModal({ communityId, onClose }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/communities/${communityId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['community-events', communityId] });
      showToast({ 
        title: 'Event Created!', 
        message: `${data.event.title} has been scheduled`,
        type: 'success' 
      });
      onClose();
    },
    onError: (error: Error) => {
      showToast({ 
        title: 'Error', 
        message: error.message, 
        type: 'error' 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !type || !startTime) {
      showToast({ 
        title: 'Error', 
        message: 'Please fill in all required fields', 
        type: 'error' 
      });
      return;
    }

    // Validate dates
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;
    
    if (start <= new Date()) {
      showToast({ 
        title: 'Error', 
        message: 'Event must be scheduled for the future', 
        type: 'error' 
      });
      return;
    }

    if (end && end <= start) {
      showToast({ 
        title: 'Error', 
        message: 'End time must be after start time', 
        type: 'error' 
      });
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || null,
      type,
      startTime,
      endTime: endTime || null,
      location: location.trim() || null,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
    });
  };

  // Get minimum datetime for input (current time + 1 hour)
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Create Community Event</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this event about?"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {description.length}/500 characters
            </p>
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Type <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eventTypes.map((eventType) => (
                <button
                  key={eventType.value}
                  type="button"
                  onClick={() => setType(eventType.value)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-colors',
                    type === eventType.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-muted border-input'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{eventType.emoji}</span>
                    <div>
                      <div className="font-medium">{eventType.label}</div>
                      <div className="text-sm opacity-80">
                        {eventType.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Time <span className="text-destructive">*</span>
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min={minDateTime}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={startTime || minDateTime}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Location and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Online, Discord, etc."
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="Leave empty for unlimited"
                min="1"
                max="10000"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onPress={onClose}
              mode="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending}
              className="flex-1"
            >
              Create Event
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}