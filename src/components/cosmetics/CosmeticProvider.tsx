'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserCosmetics } from '@/hooks/useUserCosmetics';

interface CosmeticContextType {
  activeCosmetics: any[];
  getActiveCosmetic: (type: 'THEME' | 'BANNER' | 'NAMEPLATE' | 'PFP_FRAME') => any;
  loading: boolean;
  error: string | null;
}

const CosmeticContext = createContext<CosmeticContextType | undefined>(undefined);

interface CosmeticProviderProps {
  children: ReactNode;
  userId?: string;
}

export function CosmeticProvider({ children, userId }: CosmeticProviderProps) {
  const { activeCosmetics, getActiveCosmetic, loading, error } = useUserCosmetics(userId);

  return (
    <CosmeticContext.Provider value={{ activeCosmetics, getActiveCosmetic, loading, error }}>
      {children}
    </CosmeticContext.Provider>
  );
}

export function useCosmetics() {
  const context = useContext(CosmeticContext);
  if (context === undefined) {
    throw new Error('useCosmetics must be used within a CosmeticProvider');
  }
  return context;
}