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
    <div>
      {shouldShowCreatePost && (
        <div className="mt-4">
          <CreatePostModalLauncher />
        </div>
      )}
      {profile && <Posts type="profile" userId={profile.id} />}
    </div>
  )
}
