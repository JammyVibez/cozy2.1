import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserCosmetic {
  id: string;
  isActive: boolean;
  cosmetic: {
    id: string;
    type: 'THEME' | 'BANNER' | 'NAMEPLATE' | 'PFP_FRAME';
    name: string;
    preview: string;
    assetUrl: string;
    metadata?: any;
  };
}

export function useUserCosmetics(userId?: string) {
  const { data: session } = useSession();
  const [cosmetics, setCosmetics] = useState<UserCosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || session?.user?.id;

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    fetchUserCosmetics();
  }, [targetUserId]);

  const fetchUserCosmetics = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/users/${targetUserId}/cosmetics`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user cosmetics');
      }
      
      const data = await response.json();
      setCosmetics(data.cosmetics || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCosmetics([]);
    } finally {
      setLoading(false);
    }
  };

  // Get active cosmetics by type
  const getActiveCosmetic = (type: 'THEME' | 'BANNER' | 'NAMEPLATE' | 'PFP_FRAME') => {
    return cosmetics.find(uc => uc.isActive && uc.cosmetic.type === type)?.cosmetic;
  };

  // Get all active cosmetics
  const activeCosmetics = cosmetics.filter(uc => uc.isActive).map(uc => uc.cosmetic);

  return {
    cosmetics,
    activeCosmetics,
    getActiveCosmetic,
    loading,
    error,
    refetch: fetchUserCosmetics
  };
}