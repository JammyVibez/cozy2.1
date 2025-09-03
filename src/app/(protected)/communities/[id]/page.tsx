import { notFound } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma/prisma"
import { CommunityHeader } from "@/components/CommunityHeader"
import { CommunityTabs } from "@/components/CommunityTabs"
import { CommunityPosts } from "@/components/CommunityPosts"
import { CommunityEvents } from "@/components/CommunityEvents"
import { CommunityChatRooms } from "@/components/CommunityChatRooms"

// Helper
async function getCommunity(id: string, userId: string) {
  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePhoto: true,
        },
      },
      members: {
        where: { userId },
        select: { id: true, role: true, joinedAt: true },
      },
      zones: { orderBy: { order: "asc" } },
      _count: { select: { members: true, posts: true } },
    },
  })

  if (!community) return null

  return {
    ...community,
    isJoined: community.members.length > 0,
    userRole: community.members[0]?.role || null,
    isCreator: community.creatorId === userId,
  }
}

// ✅ Next.js 15 compatible props type
interface CommunityPageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ tab?: string }>
}

export default async function CommunityPage({ params, searchParams }: CommunityPageProps) {
  const session = await auth()
  if (!session?.user?.id) notFound()

  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const community = await getCommunity(resolvedParams.id, session.user.id)
  if (!community) notFound()

  const activeTab = resolvedSearchParams?.tab || "posts"

  return (
    <div className="space-y-6">
      <CommunityHeader community={community} />
      <CommunityTabs communityId={community.id} activeTab={activeTab} />

      {activeTab === "posts" && (
        <CommunityPosts
          communityId={community.id}
          zones={community.zones.map((zone) => ({
            ...zone,
            emoji: zone.emoji || undefined,
          }))}
        />
      )}

      {activeTab === "events" && (
        <CommunityEvents
          communityId={community.id}
          canCreateEvents={
            community.isCreator ||
            ["ADMIN", "MODERATOR"].includes(community.userRole || "")
          }
        />
      )}

      {activeTab === "chat" && (
        <CommunityChatRooms
          communityId={community.id}
          canCreateRooms={
            community.isCreator ||
            ["ADMIN", "MODERATOR"].includes(community.userRole || "")
          }
        />
      )}

      {activeTab === "members" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium mb-2">Members List Coming Soon</h3>
          <p className="text-muted-foreground">
            Member management features are being developed.
          </p>
        </div>
      )}

      {activeTab === "about" && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">ℹ️</div>
          <h3 className="text-lg font-medium mb-2">Community Info</h3>
          <p className="text-muted-foreground">
            Detailed community information and settings are being developed.
          </p>
        </div>
      )}
    </div>
  )
}
