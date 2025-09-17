
import { pusher } from './pusherServer';

export class RealtimeService {
  static async broadcastCommunityUpdate(communityId: string, data: any) {
    try {
      await pusher.trigger('community-management', 'community-update', {
        communityId,
        ...data
      });
    } catch (error) {
      console.error('Error broadcasting community update:', error);
    }
  }

  static async broadcastNewActivity(activity: any) {
    try {
      await pusher.trigger('recent-activity', 'new-activity', activity);
    } catch (error) {
      console.error('Error broadcasting new activity:', error);
    }
  }

  static async broadcastTrendingUpdate(users: any[]) {
    try {
      await pusher.trigger('trending-users', 'trending-update', users);
    } catch (error) {
      console.error('Error broadcasting trending update:', error);
    }
  }

  static async broadcastCommunityStats(stats: any) {
    try {
      await pusher.trigger('community-management', 'stats-update', stats);
    } catch (error) {
      console.error('Error broadcasting community stats:', error);
    }
  }

  static async broadcastActiveCommunities(communities: any[]) {
    try {
      await pusher.trigger('active-communities', 'community-activity', communities);
    } catch (error) {
      console.error('Error broadcasting active communities:', error);
    }
  }
}
