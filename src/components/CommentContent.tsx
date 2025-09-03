import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/cn';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { useTextDesignModal } from './TextDesignModal';

export function CommentContent({
  commentId,
  name,
  username,
  content,
  createdAt,
  shouldHighlight,
}: {
  commentId: number;
  name: string | null;
  username: string | null;
  content: string;
  createdAt: string | Date;
  shouldHighlight?: boolean;
}) {
  const { data: session } = useSession();
  const { openModal, Modal } = useTextDesignModal();
  const [textDesign, setTextDesign] = useState<any>(null);
  const isOwnComment = session?.user?.username === username;

  // Fetch text design for this comment
  useEffect(() => {
    const fetchTextDesign = async () => {
      try {
        const response = await fetch(`/api/comments/${commentId}/text-design`);
        if (response.ok) {
          const design = await response.json();
          setTextDesign(design);
        }
      } catch (error) {
        // No design applied, that's okay
      }
    };
    
    if (commentId) {
      fetchTextDesign();
    }
  }, [commentId]);

  const openTextDesigner = useCallback(() => {
    if (!content) return;
    
    openModal({
      content,
      type: 'comment',
      targetId: commentId,
      initialStyles: textDesign?.styles,
      initialIframeUrl: textDesign?.iframeUrl,
      onSave: (styles, iframeUrl) => {
        setTextDesign({ styles, iframeUrl });
      },
    });
  }, [content, openModal, commentId, textDesign]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shouldHighlight) return;
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [shouldHighlight]);

  return (
    <div ref={ref}>
      <h3 className="text-md font-semibold">
        <Link href={`/${username}`} className="link text-foreground">
          {name}
        </Link>
      </h3>
      <p className="text-muted-foreground">@{username}</p>
      <div
        className={cn(
          'my-2 rounded-[32px] rounded-ss-none px-6 py-3',
          !shouldHighlight ? 'border border-input' : 'ring-2 ring-primary',
        )}>
        {/* Text Design Button for Comment Owner */}
        {isOwnComment && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={openTextDesigner}
              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-1"
            >
              🎨 Design
            </button>
          </div>
        )}
        
        {/* Comment Content with Applied Styles */}
        <div
          className="mb-1 text-foreground"
          style={textDesign?.styles}
        >
          {textDesign?.iframeUrl ? (
            <div className="mb-2">
              <iframe
                src={textDesign.iframeUrl}
                className="w-full h-20 border border-gray-200 dark:border-gray-700 rounded"
                sandbox="allow-scripts allow-same-origin"
                title="Comment Design"
              />
            </div>
          ) : null}
          <div className={textDesign ? 'styled-content' : ''}>
            <HighlightedMentionsAndHashTags text={content} shouldAddLinks />
          </div>
        </div>
        
        <p className="ml-auto text-sm text-muted-foreground">{formatDistanceToNowStrict(new Date(createdAt))} ago</p>
      </div>
      
      {/* Text Design Modal */}
      <Modal />
    </div>
  );
}
