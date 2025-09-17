
'use client';

import Pusher from 'pusher-js';

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher {
  if (!pusherClient) {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
      console.warn('Pusher configuration missing. Real-time features will be disabled.');
      // Return a mock client that does nothing
      return {
        subscribe: () => ({
          bind: () => {},
          unbind: () => {},
          unbind_all: () => {}
        }),
        unsubscribe: () => {},
        disconnect: () => {}
      } as any;
    }

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
  }

  return pusherClient;
}

export function disconnectPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null;
  }
}
