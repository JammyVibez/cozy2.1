
'use client';

import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher {
  if (!pusherClient) {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return createMockPusher();
    }

    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.warn('Pusher configuration missing. Real-time features will be disabled.');
      return createMockPusher();
    }

    try {
      pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        enabledTransports: ['ws', 'wss'],
        forceTLS: true,
        authEndpoint: '/api/pusher/auth',
        auth: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        // Add retry configuration
        activityTimeout: 30000,
        pongTimeout: 6000,
        unavailableTimeout: 10000,
      });

      pusherClient.connection.bind('connected', () => {
        console.log('Pusher connected successfully');
      });

      pusherClient.connection.bind('error', (error: any) => {
        console.error('Pusher connection error:', error);
      });

      pusherClient.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
      });

      pusherClient.connection.bind('failed', () => {
        console.error('Pusher connection failed');
      });
    } catch (error) {
      console.error('Failed to initialize Pusher:', error);
      return createMockPusher();
    }
  }

  return pusherClient;
}

function createMockPusher(): Pusher {
  return {
    subscribe: () => ({
      bind: () => {},
      unbind: () => {},
      unbind_all: () => {},
      trigger: () => Promise.resolve()
    }),
    unsubscribe: () => {},
    disconnect: () => {},
    connection: {
      bind: () => {},
      unbind: () => {},
      state: 'disconnected'
    }
  } as any;
}

export function disconnectPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}
