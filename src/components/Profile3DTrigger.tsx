'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Profile3DPopup } from './Profile3DPopup';
import { GetUser } from '@/types/definitions';
import { cn } from '@/lib/cn';

interface Profile3DTriggerProps {
  user: GetUser;
  children: React.ReactNode;
  isOwnProfile?: boolean;
  className?: string;
  /** Whether to show a subtle 3D hover effect on the trigger */
  show3DEffect?: boolean;
}

export function Profile3DTrigger({ 
  user, 
  children, 
  isOwnProfile = false, 
  className,
  show3DEffect = true 
}: Profile3DTriggerProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setIsPopupOpen(true);
    }
  };

  const trigger3DVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: 2,
      z: 10,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 100
      }
    },
    tap: {
      scale: 0.98,
      rotateY: 2,
      rotateX: 1,
      transition: { 
        type: "spring", 
        damping: 20,
        stiffness: 200
      }
    }
  };

  return (
    <>
      <motion.div
        variants={show3DEffect ? trigger3DVariants : undefined}
        whileHover={show3DEffect ? "hover" : undefined}
        whileTap={show3DEffect ? "tap" : undefined}
        onClick={handleOpenPopup}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View ${user.name}'s profile popup`}
        className={cn(
          "cursor-pointer transform-gpu preserve-3d focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
          show3DEffect && "transition-all duration-200",
          className
        )}
        style={{ perspective: '1000px' }}
      >
        {children}
      </motion.div>

      <Profile3DPopup
        user={user}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        isOwnProfile={isOwnProfile}
      />
    </>
  );
}

// Enhanced Profile Photo wrapper with 3D trigger
export function Profile3DPhoto({ 
  user, 
  size = "md",
  className,
  show3DEffect = true 
}: { 
  user: GetUser; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  show3DEffect?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <Profile3DTrigger 
      user={user} 
      className={cn(sizeClasses[size], className)}
      show3DEffect={show3DEffect}
    >
      <div className="relative w-full h-full">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={`${user.name}'s profile`}
            className="w-full h-full rounded-full object-cover border-2 border-border shadow-md hover:shadow-lg transition-shadow"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-muted border-2 border-border shadow-md hover:shadow-lg transition-shadow flex items-center justify-center text-lg font-bold text-muted-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* 3D popup indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </div>
    </Profile3DTrigger>
  );
}

// Enhanced Profile Block with 3D trigger
export function Profile3DBlock({
  user,
  time,
  type = 'post',
  className
}: {
  user: GetUser;
  time: string;
  type?: 'post' | 'comment';
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="h-12 w-12 flex-shrink-0">
        <Profile3DPhoto user={user} size="md" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 sm:gap-3">
          <Profile3DTrigger user={user} show3DEffect={false}>
            <h2 className="cursor-pointer text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
              {user.name}
            </h2>
          </Profile3DTrigger>
          {type === 'comment' && <h2 className="text-sm text-muted-foreground/90">{time} ago</h2>}
        </div>
        {type === 'post' && <h2 className="text-sm text-muted-foreground/90">{time} ago</h2>}
      </div>
    </div>
  );
}