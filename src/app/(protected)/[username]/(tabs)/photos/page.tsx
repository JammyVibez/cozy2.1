import { GetVisualMedia } from "@/types/definitions"
import { getProfile } from "../../getProfile"
import { Gallery } from "./Gallery"

// ✅ Proper typing for generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  return {
    title: profile?.name ? `Photos | ${profile.name}` : "Photos",
  }
}

async function getVisualMedia(username: string) {
  const profile = await getProfile(username)
  const res = await fetch(`${process.env.URL}/api/users/${profile?.id}/photos`, { cache: "no-store" })

  if (!res.ok) throw new Error("Error fetching user's photos.")
  return (await res.json()) as GetVisualMedia[]
}

// ✅ Proper typing for Page
export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const visualMedia = await getVisualMedia(resolvedParams.username)
  return <Gallery visualMedia={visualMedia} />
}
