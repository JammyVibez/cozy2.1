import { Posts } from '@/components/Posts';

interface PageProps {
  params: Promise<{ hashtag: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-4xl font-bold">#{resolvedParams.hashtag}</h1>
      <Posts type="hashtag" hashtag={resolvedParams.hashtag} />
    </div>
  );
}
