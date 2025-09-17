'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOverlayTriggerState } from 'react-stately';
import Link from 'next/link';
import { Modal } from './Modal';
import { GetUser } from '@/types/definitions';
import { cn } from '@/lib/cn';
import Button from './ui/Button';
import { 
  TwoPeople, 
  Heart, 
  Comment, 
  Send,
  Close,
  WorldNet,
  Calendar
} from '@/svg_components';
import { useUserCosmetics } from '@/hooks/useUserCosmetics';
import { CosmeticAvatar } from './cosmetics/CosmeticAvatar';

interface Profile3DPopupProps {
  user: GetUser;
  isOpen: boolean;
  onClose: () => void;
  isOwnProfile?: boolean;
}

export function Profile3DPopup({ user, isOpen, onClose, isOwnProfile = false }: Profile3DPopupProps) {
  const state = useOverlayTriggerState({ isOpen, onOpenChange: (open) => !open && onClose() });
  const [isHovered, setIsHovered] = useState(false);
  const { activeCosmetics, getActiveCosmetic } = useUserCosmetics(user.id);

  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.3,
      rotateY: -90,
      z: -200,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 0.6,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.3,
      rotateY: 90,
      z: -200,
      transition: {
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { type: "spring", damping: 15 }
    }
  };

  const cardStyle = {
    background: getActiveCosmetic('THEME')?.metadata?.gradient || 
                'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal state={state}>
          <div className="flex items-center justify-center min-h-screen p-4" style={{ perspective: '1000px' }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              style={cardStyle}
              className={cn(
                "relative w-full max-w-md mx-auto",
                "bg-card/90 backdrop-blur-xl border border-border/50",
                "rounded-3xl shadow-2xl overflow-hidden",
                "transform-gpu preserve-3d",
                isHovered && "shadow-purple-500/20 shadow-3xl"
              )}
            >
              {/* Close button */}
              <div className="absolute top-4 right-4 z-20">
                <Button 
                  Icon={Close} 
                  mode="ghost" 
                  size="small"
                  onPress={onClose}
                  className="bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                  aria-label="Close profile popup"
                />
              </div>

              {/* Cover Photo with 3D effect */}
              <motion.div 
                variants={itemVariants}
                className="relative h-32 overflow-hidden"
                style={{
                  background: user.coverPhoto 
                    ? `url(${user.coverPhoto})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {getActiveCosmetic('BANNER') && (
                  <div 
                    className="absolute inset-0 opacity-80"
                    style={{
                      backgroundImage: `url(${getActiveCosmetic('BANNER')?.assetUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </motion.div>

              {/* Profile section */}
              <div className="px-6 pb-6 -mt-12 relative z-10">
                {/* Profile Photo with 3D hover effect */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 15,
                    z: 20,
                    transition: { type: "spring", damping: 10 }
                  }}
                  className="relative mb-4"
                >
                  <div className="w-24 h-24 mx-auto">
                    {user.profilePhoto ? (
                      <CosmeticAvatar
                        src={user.profilePhoto}
                        alt={`${user.name}'s profile`}
                        size="xl"
                        className="border-4 border-background shadow-xl"
                      />
                    ) : (
                      <div className="w-full h-full border-4 border-background shadow-xl rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  {/* Verification badge - use a simple check for now */}
                  {user.profilePhoto && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>

                {/* User Info */}
                <motion.div variants={itemVariants} className="text-center mb-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {user.name}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-2">
                    @{user.username}
                  </p>
                  {user.bio && (
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {user.bio}
                    </p>
                  )}
                </motion.div>

                {/* Stats with animated counters */}
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-center gap-6 mb-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-center"
                  >
                    <div className="text-lg font-bold text-foreground">
                      {user.followerCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-center"
                  >
                    <div className="text-lg font-bold text-foreground">
                      {user.followingCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-center"
                  >
                    <div className="text-lg font-bold text-foreground">
                      {Math.floor(Math.random() * 500)} {/* Placeholder for posts count */}
                    </div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="space-y-3">
                  {!isOwnProfile && (
                    <div className="flex gap-2">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          size="medium"
                        >
                          <TwoPeople className="w-4 h-4 mr-2" />
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05, rotateZ: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          mode="secondary"
                          size="medium"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  )}

                  {/* View Full Profile Button */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={`/${user.username}`} onClick={onClose}>
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                        size="medium"
                      >
                        <WorldNet className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div 
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"
                />
                <motion.div 
                  animate={{ 
                    rotate: -360,
                    scale: [1, 0.8, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"
                />
              </div>
            </motion.div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}