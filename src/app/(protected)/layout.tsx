import { MenuBar } from '@/components/MenuBar';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { RealtimeChat } from '@/components/RealtimeChat';
import { RightSidebar } from '@/components/RightSidebar';
import { useCheckIfRequiredFieldsArePopulated } from '@/hooks/useCheckIfRequiredFieldsArePopulated';
import React from 'react';
import StatusViewer from '@/components/StatusViewer';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This runs only once on the initial load of this layout
  // e.g. when the user signs in/up or on hard reload
  await useCheckIfRequiredFieldsArePopulated();

  return (
    <div className="md:flex md:justify-center md:gap-4 max-w-7xl mx-auto">
      <MenuBar />

      <ResponsiveContainer className="pb-20 md:pb-4 flex-1">
        <div className="flex-1 flex gap-6">
          <main className="flex-1 max-w-2xl mx-auto space-y-6">
            {children}
          </main>
          <RightSidebar />
        </div>
      </ResponsiveContainer>

      <StatusViewer />
      <RealtimeChat />
    </div>
  );
}