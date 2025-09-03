'use client';

import { Post } from '@/components/Post';
import { useCallback, useState, use } from 'react';

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default function Page({ params }: PageProps) {
  const resolvedParams = use(params);
  const postId = parseInt(resolvedParams.postId, 10);
  const [commentsShown, setCommentsShown] = useState(true);

  const toggleComments = useCallback(() => setCommentsShown((prev) => !prev), []);

  return (
    <div className="m-4">
      <Post id={postId} commentsShown={commentsShown} toggleComments={toggleComments} />
    </div>
  );
}
