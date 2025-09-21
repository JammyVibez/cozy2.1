'use client';

import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import SvgComment from '@/svg_components/Comment';
import { AnimatePresence, motion } from 'framer-motion';
import { GetPost, PostId } from '@/types/definitions';
import { isEqual } from 'lodash';
import SvgHeart from '@/svg_components/Heart';
import { useQuery } from '@tanstack/react-query';
import { usePostLikesMutations } from '@/hooks/mutations/usePostLikesMutations';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { ToggleStepper } from './ui/ToggleStepper';
import { Comments } from './Comments';
import { PostVisualMediaContainer } from './PostVisualMediaContainer';
import ProfileBlock from './ProfileBlock';
import { HighlightedMentionsAndHashTags } from './HighlightedMentionsAndHashTags';
import { PostOptions } from './PostOptions';
import { TipButton } from './TipButton';
import { useTextDesignModal } from './TextDesignModal';

export const Post = memo(
  ({
    id: postId,
    commentsShown,
    toggleComments,
  }: PostId & {
    toggleComments: (postId: number) => void;
  }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const { likeMutation, unLikeMutation } = usePostLikesMutations({ postId });
    const { openModal, Modal } = useTextDesignModal();
    const [textDesign, setTextDesign] = useState<any>(null);
    const { theme } = useEnhancedTheme();
    const { variant, actualMode } = theme;

    const { data, isPending, isError } = useQuery<GetPost>({
      queryKey: ['posts', postId],
      queryFn: async () => {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) {
          throw new Error('Error getting post');
        }
        return (await res.json()) as GetPost;
      },
      staleTime: 60000 * 10,
    });

    // Fetch text design for this post
    useEffect(() => {
      const fetchTextDesign = async () => {
        try {
          const response = await fetch(`/api/posts/${postId}/text-design`);
          if (response.ok) {
            const design = await response.json();
            setTextDesign(design);
          }
        } catch (error) {
          // No design applied, that's okay
        }
      };
      
      if (postId) {
        fetchTextDesign();
      }
    }, [postId]);

    const likePost = useCallback(() => likeMutation.mutate(), [likeMutation]);
    const unLikePost = useCallback(() => unLikeMutation.mutate(), [unLikeMutation]);
    const handleLikeToggle = useCallback(
      (isSelected: boolean) => {
        if (isSelected) {
          likePost();
        } else {
          unLikePost();
        }
      },
      [likePost, unLikePost],
    );
    const handleCommentsToggle = useCallback(() => {
      toggleComments(postId);
    }, [postId, toggleComments]);

    const variants = useMemo(
      () => ({
        animate: {
          height: 'auto',
          overflow: 'visible',
        },
        exit: {
          height: 0,
          overflow: 'hidden',
        },
      }),
      [],
    );

    if (isPending) return <p>Loading...</p>;
    if (isError) return <p>Error loading post.</p>;
    if (!data) return <p>This post no longer exists.</p>;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { content, createdAt, user: author, visualMedia, isLiked, _count } = data;
    
    const openTextDesigner = useCallback(() => {
      if (!content) return;
      
      openModal({
        content,
        type: 'post',
        targetId: postId,
        initialStyles: textDesign?.styles,
        initialIframeUrl: textDesign?.iframeUrl,
        onSave: (styles, iframeUrl) => {
          setTextDesign({ styles, iframeUrl });
        },
      });
    }, [content, openModal, postId, textDesign]);
    const isOwnPost = userId === author.id;
    const numberOfLikes = _count.postLikes;

    return (
      <article 
        className={cn(
          "bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200",
          "hover:border-border/80 group",
          `theme-${variant}`,
          actualMode
        )}
        data-theme={variant}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <ProfileBlock
              name={author.name!}
              username={author.username!}
              time={formatDistanceStrict(new Date(createdAt), new Date())}
              photoUrl={author.profilePhoto!}
            />
            {isOwnPost && <PostOptions postId={postId} content={content} visualMedia={visualMedia} />}
          </div>
        {content && (
          <div className="mb-4">
            {/* Text Design Button for Post Owner */}
            {isOwnPost && (
              <div className="mb-3 flex justify-end">
                <button
                  onClick={openTextDesigner}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-1"
                >
                  🎨 Design Text
                </button>
              </div>
            )}
            
            {/* Post Content with Applied Styles */}
            <div
              className="text-base leading-relaxed text-foreground"
              style={textDesign?.styles}
            >
              {textDesign?.iframeUrl ? (
                <div className="mb-4">
                  <iframe
                    src={textDesign.iframeUrl}
                    className={cn(
                      "w-full h-32 rounded-lg transition-all duration-200",
                      "border border-border/60 bg-muted/20",
                      `theme-${variant}-iframe`,
                      actualMode === 'dark' ? 'dark-iframe' : 'light-iframe'
                    )}
                    sandbox="allow-scripts allow-same-origin"
                    title="Post Design"
                    data-theme={variant}
                  />
                </div>
              ) : null}
              <div className={textDesign ? 'styled-content' : ''}>
                <HighlightedMentionsAndHashTags text={content} shouldAddLinks />
              </div>
            </div>
          </div>
        )}
        {visualMedia.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <PostVisualMediaContainer visualMedia={visualMedia} />
          </div>
        )}
        
        {/* Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1">
            <ToggleStepper
              isSelected={isLiked}
              onChange={handleLikeToggle}
              Icon={SvgHeart}
              quantity={numberOfLikes}
            />
            <ToggleStepper
              isSelected={commentsShown || false}
              onChange={handleCommentsToggle}
              Icon={SvgComment}
              quantity={_count.comments}
              color="blue"
            />
          </div>
          {!isOwnPost && (
            <TipButton 
              receiverId={author.id} 
              postId={postId}
            />
          )}
        </div>

        <AnimatePresence>
          {commentsShown && (
            <motion.div key={`${postId}-comments`} variants={variants} initial={false} animate="animate" exit="exit" className="mt-4">
              <Comments postId={postId} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Text Design Modal */}
        <Modal />
        </div>
      </article>
    );
  },
  (oldProps, newProps) => isEqual(oldProps, newProps),
);

Post.displayName = 'Post';
