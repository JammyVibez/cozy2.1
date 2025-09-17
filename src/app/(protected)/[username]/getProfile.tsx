import prisma from '@/lib/prisma/prisma';
import { GetUser } from '@/types/definitions';

export async function getProfile(username: string) {
  // Get the id of the user from the given username.
  const check = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!check) return null;

  // Use the id to fetch from the /api/users/:userId endpoint
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith('http')) 
        ? process.env.NEXTAUTH_URL
        : (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
    const res = await fetch(`${baseUrl}/api/users/${check.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('API response not OK:', res.status, res.statusText);
      throw new Error(`Error fetching profile information: ${res.status} ${res.statusText}`);
    }
    
    const user: GetUser = await res.json();
    return user;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw new Error('Error fetching profile information');
  }
}
