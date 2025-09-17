'use client';
import PusherJS from 'pusher-js';

let pusherClient: PusherJS | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    pusherClient = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
    });
  }
  return pusherClient;
};

// Export the client directly for backward compatibility
export { pusherClient };