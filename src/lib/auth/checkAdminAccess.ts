import { auth } from '@/auth';
import prisma from '@/lib/prisma/prisma';

export async function checkAdminAccess(): Promise<{ isAdmin: boolean; user?: any }> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { isAdmin: false };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { premiumBadge: true }
    });

    if (!user) {
      return { isAdmin: false };
    }

    // Check admin access - you can customize this logic
    const isAdmin = user.premiumBadge || user.email === process.env.ADMIN_EMAIL;
    
    return { isAdmin, user };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { isAdmin: false };
  }
}