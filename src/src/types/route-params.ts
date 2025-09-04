/**
 * Shared helper type for Next.js 15 App Router page props
 * Replaces deprecated PageProps to avoid constraint errors
 */
export interface RouteParams<T extends Record<string, string> = Record<string, string>> {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Client-side route params (for 'use client' pages)
export interface ClientRouteParams<T extends Record<string, string> = Record<string, string>> {
  params: T;
  searchParams?: Record<string, string | string[] | undefined>;
}

// Common route parameter types (for server components)
export interface UsernameRouteParams extends RouteParams<{ username: string }> {}
export interface PostIdRouteParams extends RouteParams<{ postId: string }> {}
export interface CommentIdRouteParams extends RouteParams<{ commentId: string }> {}
export interface CommunityIdRouteParams extends RouteParams<{ id: string }> {}
export interface HashtagRouteParams extends RouteParams<{ hashtag: string }> {}
export interface ChatIdRouteParams extends RouteParams<{ chatId: string }> {}

// Client-side route parameter types (for 'use client' pages)
export interface ClientPostIdRouteParams extends ClientRouteParams<{ postId: string }> {}
export interface ClientHashtagRouteParams extends ClientRouteParams<{ hashtag: string }> {}
export interface ClientUsernameRouteParams extends ClientRouteParams<{ username: string }> {}

// Metadata generation helper
export interface MetadataProps<T extends Record<string, string> = Record<string, string>> {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}