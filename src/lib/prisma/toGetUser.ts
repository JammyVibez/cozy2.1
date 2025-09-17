/**
 * Use this function to convert the returned user from a prisma
 * query that uses the `includeToUser()` function to the GetUser
 * type.
 */

import { FindUserResult, GetUser } from '@/types/definitions';
import { fileNameToUrl } from '../s3/fileNameToUrl';

export const toGetUser = (user: any): GetUser => ({
  id: user.id,
  name: user.name,
  username: user.username,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  profilePhoto: user.profilePhoto,
  coverPhoto: user.coverPhoto,
  bio: user.bio,
  followerCount: user._count?.followers || 0,
  followingCount: user._count?.following || 0,
  followers: user.followers || [],
  isFollowing: user.followers?.length > 0,
  isBanned: user.isBanned,
  isActive: user.isActive,
  banReason: user.banReason,
  bannedAt: user.bannedAt,
  suspendedUntil: user.suspendedUntil,
});