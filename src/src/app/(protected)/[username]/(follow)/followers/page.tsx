import { DiscoverProfiles } from '@/components/DiscoverProfiles'
import { DiscoverSearch } from '@/components/DiscoverSearch'
import { DiscoverFilters } from '@/components/DiscoverFilters'
import { getProfile } from '../../getProfile'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)
  return {
    title: profile?.name ? `Followers | ${profile.name}` : 'Followers',
  }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const profile = await getProfile(resolvedParams.username)

  return (
    <div className="p-4">
      <h1 className="mb-6 text-4xl font-bold">
        {profile?.name}&apos;s Followers
      </h1>
      <DiscoverSearch label="Search Followers" />
      <DiscoverFilters />
      <DiscoverProfiles followersOf={profile?.id} />
    </div>
  )
}
