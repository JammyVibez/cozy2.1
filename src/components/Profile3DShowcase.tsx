'use client';

import { motion } from 'framer-motion';
import { Profile3DPhoto, Profile3DBlock, Profile3DTrigger } from './Profile3DTrigger';
import { GetUser } from '@/types/definitions';
import { cn } from '@/lib/cn';

// Mock user data for demonstration
const mockUsers: GetUser[] = [
  {
    id: 'demo-1',
    name: 'Alice Johnson',
    username: 'alice_dev',
    email: 'alice@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=300&fit=crop',
    bio: '🚀 Frontend Developer | React & TypeScript enthusiast | Coffee lover ☕',
    followerCount: 1250,
    followingCount: 340,
    isFollowing: false,
    hashedPassword: null,
    gender: null,
    birthDate: null,
    phoneNumber: null,
    address: null,
    website: 'https://alice-dev.com',
    relationshipStatus: null,
    emailVerified: new Date(),
    image: null,
    cozyCoins: 0,
  },
  {
    id: 'demo-2',
    name: 'Bob Chen',
    username: 'bob_designer',
    email: 'bob@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop',
    bio: '🎨 UI/UX Designer | Creating beautiful digital experiences | Design systems advocate',
    followerCount: 890,
    followingCount: 156,
    isFollowing: true,
    hashedPassword: null,
    gender: null,
    birthDate: null,
    phoneNumber: null,
    address: null,
    website: 'https://bobchen.design',
    relationshipStatus: null,
    emailVerified: new Date(),
    image: null,
    cozyCoins: 0,
  },
  {
    id: 'demo-3',
    name: 'Sarah Kim',
    username: 'sarah_tech',
    email: 'sarah@example.com',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    coverPhoto: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=300&fit=crop',
    bio: '💻 Full-stack Engineer | Building scalable web applications | Tech mentor & speaker',
    followerCount: 2100,
    followingCount: 423,
    isFollowing: false,
    hashedPassword: null,
    gender: null,
    birthDate: null,
    phoneNumber: null,
    address: null,
    website: 'https://sarahkim.tech',
    relationshipStatus: null,
    emailVerified: new Date(),
    image: null,
    cozyCoins: 0,
  }
];

export function Profile3DShowcase() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 20 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          ✨ 3D Profile Popup Experience
        </h2>
        <p className="text-muted-foreground">
          Click on any profile photo or name to experience the beautiful 3D popup!
        </p>
      </motion.div>

      {/* 3D Photo Gallery */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4">3D Profile Photos</h3>
        <div className="flex gap-6 justify-center">
          {mockUsers.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Profile3DPhoto 
                user={user} 
                size="xl" 
                className="mb-2"
              />
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Profile Blocks Demo */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4">Interactive Profile Blocks</h3>
        <div className="space-y-4">
          {mockUsers.map((user, index) => (
            <motion.div
              key={user.id}
              variants={itemVariants}
              className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-shadow"
            >
              <Profile3DBlock
                user={user}
                time={`${Math.floor(Math.random() * 24)}h`}
                type={index % 2 === 0 ? 'post' : 'comment'}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4">✨ Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20"
          >
            <div className="text-2xl mb-2">🎭</div>
            <h4 className="font-semibold mb-2">3D Animations</h4>
            <p className="text-sm text-muted-foreground">
              Beautiful spring-based 3D animations with depth and perspective effects
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20"
          >
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-semibold mb-2">Cosmetic Integration</h4>
            <p className="text-sm text-muted-foreground">
              Supports user cosmetics, themes, and customizations seamlessly
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02, rotateY: 5 }}
            className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20"
          >
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-2">Performance</h4>
            <p className="text-sm text-muted-foreground">
              Optimized with GPU acceleration and smooth 60fps animations
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div 
        variants={itemVariants}
        className="bg-card rounded-xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold mb-3">🎯 How to Use</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Click any profile photo to open the immersive 3D popup experience
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Hover over profile elements to see subtle 3D effects and interactions
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
            Use "View Full Profile" button to navigate to the complete profile page
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Experience smooth animations powered by Framer Motion and CSS 3D transforms
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}