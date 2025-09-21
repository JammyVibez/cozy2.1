
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { CommunityManagementDashboard } from '@/components/CommunityManagementDashboard';
import prisma from '@/lib/prisma/prisma';

export const metadata = {
  title: 'Community Management - Munia',
  description: 'Manage communities, analytics, and moderation tools',
};

export default async function CommunityManagementPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get user from database to check role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user) {
    redirect('/login');
  }

  // Check if user has admin privileges
  const prismaRole = user.role;
  const isAdminOrModerator = ['ADMIN', 'MODERATOR'].includes(prismaRole);

  if (!isAdminOrModerator) {
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

  // Map Prisma role to component expected role
  const userRole: 'ADMIN' | 'MODERATOR' | 'MEMBER' = prismaRole === 'USER' ? 'MEMBER' : prismaRole;

  return (
    <div className="container mx-auto py-8">
      <CommunityManagementDashboard 
        userRole={userRole}
        userId={session.user.id}
      />
    </div>
  );
}
