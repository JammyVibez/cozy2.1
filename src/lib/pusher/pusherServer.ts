import PusherServer from 'pusher';

if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_SECRET) {
  throw new Error('Missing Pusher server environment variables');
}

export const pusher = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});