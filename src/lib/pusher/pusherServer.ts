import PusherServer from 'pusher';

// Create a mock pusher for development if credentials are missing
const createMockPusher = () => ({
  trigger: async () => ({ status: 200 }),
  triggerBatch: async () => ({ status: 200 }),
  authorizeChannel: () => ({}),
  authenticate: () => ({}),
});

let pusherInstance: PusherServer | any;

try {
  if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_SECRET || !process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
    console.warn('Missing Pusher server environment variables. Using mock pusher for development.');
    pusherInstance = createMockPusher();
  } else {
    pusherInstance = new PusherServer({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });
  }
} catch (error) {
  console.error('Failed to initialize Pusher server:', error);
  pusherInstance = createMockPusher();
}

export const pusher = pusherInstance;