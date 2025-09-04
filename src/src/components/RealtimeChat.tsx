'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getPusherClient } from '@/lib/pusher/pusherClientSide';
import { cn } from '@/lib/cn';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { 
  Close,
  Send,
  TwoPeople,
  DeviceLaptop
} from '@/svg_components';

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string | null;
  };
  createdAt: string;
  read: boolean;
}

interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    username: string;
    profilePhoto: string | null;
    isOnline: boolean;
    lastSeen?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
}

interface TypingUser {
  userId: string;
  username: string;
  chatId: string;
}

export function RealtimeChat() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch chats
  useEffect(() => {
    if (session?.user?.id) {
      fetchChats();
    }
  }, [session]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!session?.user?.id) return;

    const pusherClient = getPusherClient();
    const channel = pusherClient.subscribe(`user-${session.user.id}`);
    const presenceChannel = pusherClient.subscribe('presence-online-users');

    // Listen for new messages
    channel.bind('new-message', (data: Message & { chatId: string }) => {
      setMessages(prev => {
        if (activeChat === data.chatId) {
          return [...prev, data];
        }
        return prev;
      });
      
      // Update chat list with new last message
      setChats(prev => prev.map(chat => 
        chat.id === data.chatId 
          ? { ...chat, lastMessage: data, unreadCount: chat.unreadCount + 1 }
          : chat
      ));
    });

    // Listen for typing indicators
    channel.bind('user-typing', (data: TypingUser) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => 
          !(user.userId === data.userId && user.chatId === data.chatId)
        );
        return [...filtered, data];
      });

      // Remove typing indicator after timeout
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => 
          !(user.userId === data.userId && user.chatId === data.chatId)
        ));
      }, 3000);
    });

    // Listen for online status updates
    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      const userIds = new Set(Object.keys(members.members));
      setOnlineUsers(userIds);
    });

    presenceChannel.bind('pusher:member_added', (member: any) => {
      setOnlineUsers(prev => new Set([...prev, member.id]));
    });

    presenceChannel.bind('pusher:member_removed', (member: any) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(member.id);
        return newSet;
      });
    });

    return () => {
      const pusherClient = getPusherClient();
      pusherClient.unsubscribe(`user-${session.user.id}`);
      pusherClient.unsubscribe('presence-online-users');
    };
  }, [session, activeChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      const data = await response.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const data = await response.json();
      setMessages(data.messages || []);
      
      // Mark messages as read
      await fetch(`/api/chats/${chatId}/read`, { method: 'POST' });
      
      // Update unread count
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const response = await fetch(`/api/chats/${activeChat}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (response.ok) {
        setNewMessage('');
        // Message will be added via real-time subscription
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (!activeChat) return;

    // Send typing indicator
    fetch('/api/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: activeChat }),
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      fetch('/api/typing', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeChat }),
      });
    }, 1000);
  };

  const selectChat = (chatId: string) => {
    setActiveChat(chatId);
    fetchMessages(chatId);
  };

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);
  const activeChatData = chats.find(chat => chat.id === activeChat);
  const otherParticipant = activeChatData?.participants.find(p => p.id !== session?.user?.id);

  if (!session) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl transition-all duration-200',
          'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
          'text-white font-semibold flex items-center gap-2'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <TwoPeople className="w-6 h-6" />
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{ width: '384px', height: '600px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-amber-500">
              <div className="flex items-center gap-3">
                <TwoPeople className="w-6 h-6 text-white" />
                <span className="font-semibold text-white">
                  {activeChat ? otherParticipant?.name : 'Chats'}
                </span>
                {activeChat && otherParticipant && (
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      onlineUsers.has(otherParticipant.id) ? 'bg-green-400' : 'bg-gray-400'
                    )} />
                    <span className="text-xs text-orange-100">
                      {onlineUsers.has(otherParticipant.id) ? 'Online' : 'Offline'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeChat && (
                  <button
                    onClick={() => setActiveChat(null)}
                    className="text-white hover:text-orange-100 transition-colors"
                  >
                    <span>&gt;</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-orange-100 transition-colors"
                >
                  <Close className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {!activeChat ? (
                /* Chat List */
                <div className="h-full overflow-y-auto">
                  {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                      <TwoPeople className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No conversations yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Start a conversation from someone's profile
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {chats.map((chat) => {
                        const otherUser = chat.participants.find(p => p.id !== session.user.id);
                        if (!otherUser) return null;

                        return (
                          <button
                            key={chat.id}
                            onClick={() => selectChat(chat.id)}
                            className="w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Image
                                  src={otherUser.profilePhoto || '/default-avatar.png'}
                                  alt={otherUser.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                {onlineUsers.has(otherUser.id) && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900 dark:text-white truncate">
                                    {otherUser.name}
                                  </span>
                                  {chat.unreadCount > 0 && (
                                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                                      {chat.unreadCount}
                                    </span>
                                  )}
                                </div>
                                {chat.lastMessage && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {chat.lastMessage.content}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Chat Messages */
                <div className="h-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => {
                          const isOwn = message.senderId === session.user.id;
                          return (
                            <div
                              key={message.id}
                              className={cn(
                                'flex',
                                isOwn ? 'justify-end' : 'justify-start'
                              )}
                            >
                              <div
                                className={cn(
                                  'max-w-xs px-4 py-2 rounded-2xl',
                                  isOwn
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-md'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                                )}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={cn(
                                  'text-xs mt-1',
                                  isOwn ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                                )}>
                                  {new Date(message.createdAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Typing Indicator */}
                        {typingUsers
                          .filter(user => user.chatId === activeChat && user.userId !== session.user.id)
                          .map((user) => (
                            <div key={user.userId} className="flex justify-start">
                              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          ))}

                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <TextInput
                        value={newMessage}
                        onChange={(value) => {
                          setNewMessage(value);
                          handleTyping();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button
                        onPress={sendMessage}
                        isDisabled={!newMessage.trim()}
                        className="px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}