import { getProfile } from "../../getProfile"
import { About } from "./About"

// ✅ Use PageProps with params typing
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  return {
    title: profile?.name ? `About | ${profile.name}` : "About",
  }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  if (!profile) return null

  return (
    <div className="mt-4">
      <About profile={profile} />
    </div>
  )
}
