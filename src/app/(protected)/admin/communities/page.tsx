
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { CommunityManagementDashboard } from '@/components/CommunityManagementDashboard';

export const metadata = {
  title: 'Community Management - Munia',
  description: 'Manage communities, analytics, and moderation tools',
};

export default async function CommunityManagementPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user has admin privileges
  // In a real implementation, you'd check this from the database
  const userRole = session.user.email === process.env.ADMIN_EMAIL ? 'ADMIN' : 'MEMBER';

  if (!['ADMIN', 'MODERATOR'].includes(userRole)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-muted-foreground">
            Only administrators and moderators can access community management tools.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <CommunityManagementDashboard 
        userRole={userRole}
        userId={session.user.id}
      />
    </div>
  );
}
