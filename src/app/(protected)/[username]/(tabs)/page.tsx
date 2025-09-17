import { Posts } from "@/components/Posts"
import { CreatePostModalLauncher } from "@/components/CreatePostModalLauncher"
import { getServerUser } from "@/lib/getServerUser"
import { getProfile } from "../getProfile"


// ✅ Properly typed generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  return {
    title: profile?.name || "Cozy",
  }
}

// ✅ Properly typed Page
export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const [user] = await getServerUser()
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  const shouldShowCreatePost = user?.id === profile?.id

  return (
    <div className="space-y-6">
      {/* Status Section */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💭</span>
            </div>
            <h3 className="font-semibold">Status</h3>
          </div>
          {shouldShowCreatePost && (
            <button className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
              Update Status
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {shouldShowCreatePost ? (
            <div className="text-sm text-muted-foreground">
              Share what you're up to right now...
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent status updates
            </div>
          )}
        </div>
      </div>

      {/* Create Post Section */}
      {shouldShowCreatePost && (
        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <CreatePostModalLauncher />
        </div>
      )}
      
      {/* Posts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <span className="text-sm font-medium text-muted-foreground">Posts</span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
        </div>
        
        {profile && <Posts type="profile" userId={profile.id} />}
      </div>
    </div>
  )
}
