'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '@/lib/cn';
import Button from './ui/Button';
import { GenericLoading } from './GenericLoading';
import { SomethingWentWrong } from './SometingWentWrong';

interface CommunityChatRoomsProps {
  communityId: string;
  canCreateRooms?: boolean;
}

export function CommunityChatRooms({ communityId, canCreateRooms = false }: CommunityChatRoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['community-chat-rooms', communityId],
    queryFn: async () => {
      const response = await fetch(`/api/communities/${communityId}/chat-rooms`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You must be a member to view chat rooms');
        }
        throw new Error('Failed to fetch chat rooms');
      }
      return response.json();
    },
  });

  if (isLoading) return <GenericLoading />;
  if (error) return <SomethingWentWrong />;

  const chatRooms = data?.chatRooms || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Community Chat</h2>
          <p className="text-muted-foreground">
            Connect with community members in real-time
          </p>
        </div>
        
        {canCreateRooms && (
          <Button className="sm:ml-auto">
            Create Chat Room
          </Button>
        )}
      </div>

      {/* Chat Rooms Grid */}
      {chatRooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-medium mb-2">No Chat Rooms Yet</h3>
          <p className="text-muted-foreground">
            {canCreateRooms
              ? 'Create the first chat room to get conversations started!'
              : 'Chat rooms will appear here when they\'re created by community moderators.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chatRooms.map((room: any) => (
            <ChatRoomCard
              key={room.id}
              room={room}
              isSelected={selectedRoom === room.id}
              onSelect={() => setSelectedRoom(room.id)}
            />
          ))}
        </div>
      )}

      {/* Chat Interface */}
      {selectedRoom && (
        <div className="bg-card border rounded-xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🚧</div>
            <h3 className="text-lg font-medium mb-2">Chat Interface Coming Soon</h3>
            <p className="text-muted-foreground">
              Real-time messaging, reactions, and file sharing features are being developed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ChatRoomCardProps {
  room: any;
  isSelected: boolean;
  onSelect: () => void;
}

function ChatRoomCard({ room, isSelected, onSelect }: ChatRoomCardProps) {
  const lastMessage = room.messages[0];
  const hasActivity = room._count.messages > 0;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'bg-card border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary border-primary'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {room.isPublic ? '🌍' : '🔒'}
              </span>
              <h3 className="font-semibold">{room.name}</h3>
            </div>
            
            {!room.isPublic && (
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Private
              </span>
            )}
          </div>

          {room.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
              {room.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>👥</span>
              {room._count.participants} members
            </div>
            
            <div className="flex items-center gap-1">
              <span>💬</span>
              {room._count.messages} messages
            </div>
          </div>

          {lastMessage && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>💭</span>
                <span>
                  <strong>@{lastMessage.sender.username}:</strong>{' '}
                  {lastMessage.content.slice(0, 50)}
                  {lastMessage.content.length > 50 ? '...' : ''}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {format(new Date(lastMessage.createdAt), 'MMM d, h:mm a')}
              </div>
            </div>
          )}
        </div>

        {hasActivity && (
          <div className="ml-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}