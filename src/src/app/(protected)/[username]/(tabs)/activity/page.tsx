import { getServerUser } from "@/lib/getServerUser"
import { getProfile } from "../../getProfile"
import { Activities } from "./Activities"

// ✅ Properly typed generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  return {
    title: profile?.name ? `Activity | ${profile.name}` : "Activity",
  }
}

// ✅ Properly typed Page
export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const [user] = await getServerUser()
  if (!user) return <p>This is a protected page.</p>

  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  const isOwn = user?.id === profile?.id

  if (!isOwn) return <p>You have no access to this page.</p>

  return (
    <div className="mt-4">
      <Activities userId={user.id} />
    </div>
  )
}
