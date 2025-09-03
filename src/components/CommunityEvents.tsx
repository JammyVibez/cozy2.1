'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '@/lib/cn';
import Button from './ui/Button';
// import { CreateEventModal } from './CreateEventModal';
import { GenericLoading } from './GenericLoading';
import { SomethingWentWrong } from './SometingWentWrong';

interface CommunityEventsProps {
  communityId: string;
  canCreateEvents?: boolean;
}

const eventTypes = [
  { value: 'ALL', label: 'All Events', emoji: '📅' },
  { value: 'DISCUSSION', label: 'Discussions', emoji: '💬' },
  { value: 'AMA', label: 'Ask Me Anything', emoji: '❓' },
  { value: 'TOURNAMENT', label: 'Tournaments', emoji: '🏆' },
  { value: 'WORKSHOP', label: 'Workshops', emoji: '🛠️' },
  { value: 'SOCIAL', label: 'Social Events', emoji: '🎉' },
  { value: 'OTHER', label: 'Other', emoji: '📝' },
];

const typeEmojis = {
  DISCUSSION: '💬',
  AMA: '❓',
  TOURNAMENT: '🏆',
  WORKSHOP: '🛠️',
  SOCIAL: '🎉',
  OTHER: '📝',
};

export function CommunityEvents({ communityId, canCreateEvents = false }: CommunityEventsProps) {
  const [selectedType, setSelectedType] = useState('ALL');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['community-events', communityId, selectedType, showUpcoming],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(selectedType !== 'ALL' && { type: selectedType }),
        ...(showUpcoming && { upcoming: 'true' }),
      });
      
      const response = await fetch(`/api/communities/${communityId}/events?${params}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return response.json();
    },
  });

  if (isLoading) return <GenericLoading />;
  if (error) return <SomethingWentWrong />;

  const events = data?.events || [];

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Events</h2>
          <p className="text-muted-foreground">
            Join discussions, workshops, and social events
          </p>
        </div>
        
        {canCreateEvents && (
          <Button
            onPress={() => setShowCreateModal(true)}
            className="sm:ml-auto"
          >
            Create Event
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Type</label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm',
                  selectedType === type.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-muted border-input'
                )}
              >
                <span>{type.emoji}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Time</label>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpcoming(true)}
              className={cn(
                'px-4 py-2 rounded-lg border transition-colors text-sm',
                showUpcoming
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-input'
              )}
            >
              📅 Upcoming
            </button>
            <button
              onClick={() => setShowUpcoming(false)}
              className={cn(
                'px-4 py-2 rounded-lg border transition-colors text-sm',
                !showUpcoming
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted border-input'
              )}
            >
              📚 All Events
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium mb-2">
            {showUpcoming ? 'No Upcoming Events' : 'No Events Yet'}
          </h3>
          <p className="text-muted-foreground">
            {canCreateEvents
              ? 'Create the first event to get the community engaged!'
              : 'Check back later for community events and activities.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Create Event Modal - Placeholder for now */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl p-6 max-w-md">
            <h3 className="text-lg font-bold mb-4">Create Event Feature</h3>
            <p className="text-muted-foreground mb-4">
              Event creation modal is being finalized. This feature will be available soon!
            </p>
            <Button onPress={() => setShowCreateModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: any;
}

function EventCard({ event }: EventCardProps) {
  const isUpcoming = new Date(event.startTime) > new Date();
  const typeEmoji = typeEmojis[event.type as keyof typeof typeEmojis] || '📝';

  return (
    <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{typeEmoji}</span>
            <span className="text-sm font-medium text-primary">
              {event.type.replace('_', ' ')}
            </span>
            {!isUpcoming && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Past Event
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          
          {event.description && (
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>🕒</span>
              {format(new Date(event.startTime), 'MMM d, yyyy at h:mm a')}
            </div>
            
            {event.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                {event.location}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <span>👥</span>
              {event._count.attendees} attending
              {event.maxAttendees && ` / ${event.maxAttendees}`}
            </div>
            
            <div className="flex items-center gap-1">
              <span>👤</span>
              by @{event.creator.username}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="sm:ml-auto">
          {isUpcoming ? (
            <Button mode="secondary" size="small">
              RSVP
            </Button>
          ) : (
            <Button mode="secondary" size="small" isDisabled>
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}