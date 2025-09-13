import { formatDistanceToNowStrict } from 'date-fns';
import { cn } from '@/lib/cn';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { useTextDesignModal } from './TextDesignModal';

export function CommentContent({
  commentId,
  name,
  username,
  userId,
  content,
  createdAt,
  shouldHighlight,
}: {
  commentId: number;
  name: string | null;
  username: string | null;
  userId: string;
  content: string;
  createdAt: string | Date;
  shouldHighlight?: boolean;
}) {
  const { data: session } = useSession();
  const { openModal, Modal } = useTextDesignModal();
  const [textDesign, setTextDesign] = useState<any>(null);
  const isOwnComment = session?.user?.id === userId;
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;

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
          'my-2 rounded-[32px] rounded-ss-none px-6 py-3 transition-all duration-200',
          'bg-muted/30 backdrop-blur-sm border border-border/40',
          !shouldHighlight ? 'border-border/40' : 'ring-2 ring-primary ring-opacity-50',
          `theme-${variant}-comment`,
          actualMode
        )}
        data-theme={variant}
      >
        {/* Text Design Button for Comment Owner */}
        {isOwnComment && (
          <div className="mb-2 flex justify-end">
            <button
              onClick={openTextDesigner}
              className={cn(
                "text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1",
                "bg-accent/60 text-accent-foreground hover:bg-accent/80",
                `theme-${variant}-button`
              )}
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
                className={cn(
                  "w-full h-20 rounded border border-border/60 bg-background/20",
                  `theme-${variant}-iframe`,
                  actualMode === 'dark' ? 'dark-iframe' : 'light-iframe'
                )}
                sandbox="allow-scripts allow-same-origin"
                title="Comment Design"
                data-theme={variant}
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
