
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isBefore } from 'date-fns';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';
import { Calendar, More } from '@/svg_components';

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  isAttending: boolean;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface CommunityEventsProps {
  communityId: string;
  canCreateEvents?: boolean;
}

export function CommunityEvents({ communityId, canCreateEvents = false }: CommunityEventsProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Mock events data
  const events: CommunityEvent[] = [
    {
      id: '1',
      title: 'Community Game Night',
      description: 'Join us for a fun evening of board games and video games!',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // +3 hours
      location: 'Community Center',
      isVirtual: false,
      maxAttendees: 20,
      currentAttendees: 12,
      isAttending: true,
      organizer: {
        id: 'user1',
        name: 'Alex Johnson',
        avatar: '/avatars/alex.jpg'
      },
      tags: ['gaming', 'social'],
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Virtual Coffee Chat',
      description: 'Weekly virtual meetup to discuss community topics',
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // +1 hour
      isVirtual: true,
      maxAttendees: 50,
      currentAttendees: 23,
      isAttending: false,
      organizer: {
        id: 'user2',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg'
      },
      tags: ['discussion', 'virtual'],
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Coding Workshop',
      description: 'Learn React hooks in this hands-on workshop',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // +2 hours
      location: 'Tech Hub',
      isVirtual: false,
      maxAttendees: 15,
      currentAttendees: 8,
      isAttending: false,
      organizer: {
        id: 'user3',
        name: 'Mike Rodriguez',
        avatar: '/avatars/mike.jpg'
      },
      tags: ['education', 'coding'],
      status: 'upcoming'
    }
  ];

  const rsvpMutation = useMutation({
    mutationFn: async ({ eventId, attending }: { eventId: string; attending: boolean }) => {
      const response = await fetch(`/api/communities/${communityId}/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attending }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update RSVP');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      showToast({
        title: variables.attending ? 'RSVP Confirmed!' : 'RSVP Cancelled',
        message: variables.attending ? 'See you at the event!' : 'Your RSVP has been cancelled',
        type: 'success'
      });
      queryClient.invalidateQueries({ queryKey: ['community-events', communityId] });
    },
    onError: (error: Error) => {
      showToast({
        title: 'RSVP Failed',
        message: error.message,
        type: 'error'
      });
    },
  });

  const handleRSVP = (event: CommunityEvent, attending: boolean) => {
    rsvpMutation.mutate({ eventId: event.id, attending });
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), date)
    );
  };

  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const generateCalendarDays = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    const days = [];
    
    let currentDate = start;
    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Events</h2>
          <p className="text-muted-foreground">
            Discover and join community activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-1 rounded text-sm transition-colors',
                viewMode === 'list' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-1 rounded text-sm transition-colors',
                viewMode === 'calendar' 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Calendar
            </button>
          </div>

          {canCreateEvents && (
            <Button onPress={() => setShowCreateModal(true)}>
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-card rounded-xl border p-6">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {generateCalendarDays().map(date => {
              const dayEvents = getEventsByDate(date);
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'min-h-[80px] p-2 rounded-lg border text-left transition-colors',
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-border',
                    isCurrentDay && !isSelected && 'border-primary'
                  )}
                >
                  <div className={cn(
                    'text-sm font-medium mb-1',
                    isCurrentDay && !isSelected && 'text-primary'
                  )}>
                    {format(date, 'd')}
                  </div>
                  
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded mb-1 truncate"
                    >
                      {event.title}
                    </div>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Selected Date Events */}
          {getEventsByDate(selectedDate).length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">
                Events on {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-3">
                {getEventsByDate(selectedDate).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRSVP={handleRSVP}
                    onViewDetails={setSelectedEvent}
                    isLoading={rsvpMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground mb-4">
                There are no events scheduled for this community yet.
              </p>
              {canCreateEvents && (
                <Button onPress={() => setShowCreateModal(true)}>
                  Create First Event
                </Button>
              )}
            </div>
          ) : (
            upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onViewDetails={setSelectedEvent}
                isLoading={rsvpMutation.isPending}
              />
            ))
          )}
        </div>
      )}

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(selectedEvent.startDate), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-muted-foreground">
                        {selectedEvent.isVirtual ? 'Virtual Event' : selectedEvent.location}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Attendance</h3>
                      <p className="text-muted-foreground">
                        {selectedEvent.currentAttendees}
                        {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`} attendees
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Organizer</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {selectedEvent.organizer.name.charAt(0)}
                      </div>
                      <span>{selectedEvent.organizer.name}</span>
                    </div>
                  </div>

                  {selectedEvent.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-muted px-2 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    mode="secondary"
                    className="flex-1"
                    onPress={() => setSelectedEvent(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onPress={() => handleRSVP(selectedEvent, !selectedEvent.isAttending)}
                    loading={rsvpMutation.isPending}
                  >
                    {selectedEvent.isAttending ? 'Cancel RSVP' : 'RSVP'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Event Card Component
function EventCard({ 
  event, 
  onRSVP, 
  onViewDetails, 
  isLoading 
}: {
  event: CommunityEvent;
  onRSVP: (event: CommunityEvent, attending: boolean) => void;
  onViewDetails: (event: CommunityEvent) => void;
  isLoading: boolean;
}) {
  const eventDate = new Date(event.startDate);
  const isEventToday = isToday(eventDate);
  const isPastEvent = isBefore(eventDate, new Date());

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            {isEventToday && (
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                Today
              </span>
            )}
            {event.isAttending && (
              <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                Attending
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(eventDate, 'MMM d • h:mm a')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{event.currentAttendees} attending</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{event.isVirtual ? '🌐' : '📍'}</span>
              <span>{event.isVirtual ? 'Virtual' : event.location}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
              {event.organizer.name.charAt(0)}
            </div>
            <span className="text-sm text-muted-foreground">
              by {event.organizer.name}
            </span>
          </div>

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="bg-muted px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          mode="secondary"
          size="small"
          onPress={() => onViewDetails(event)}
        >
          View Details
        </Button>
        
        {!isPastEvent && (
          <Button
            size="small"
            onPress={() => onRSVP(event, !event.isAttending)}
            loading={isLoading}
            mode={event.isAttending ? 'secondary' : 'primary'}
          >
            {event.isAttending ? 'Cancel RSVP' : 'RSVP'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
