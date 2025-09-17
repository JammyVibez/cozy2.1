'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface ComingSoonProps {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
}

export function ComingSoon({
  title = "Community Features Coming Soon",
  description = "We're building amazing community features that will transform how you connect and collaborate.",
  features = [
    "Real-time Community Chat Rooms",
    "Advanced Community Moderation Tools",
    "Community Events & Scheduling",
    "File Sharing & Media Galleries",
    "Voice & Video Chat Integration",
    "Custom Community Themes",
    "Community Analytics Dashboard",
    "Cross-Platform Notifications"
  ],
  className
}: ComingSoonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-muted/20 to-background",
      "flex items-center justify-center p-6",
      className
    )}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Main Icon */}
        <motion.div
          variants={itemVariants}
          className="text-8xl mb-8 select-none"
        >
          🚀
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/80 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <span className="text-lg font-medium text-left">{feature}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/communities"
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
          >
            Explore Communities
          </Link>

          <Link
            href="/feed"
            className="px-8 py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            Back to Feed
          </Link>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-16 p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-4">Development Progress</h3>
          <div className="w-full bg-muted rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-muted-foreground">
            75% Complete • Expected Launch: Q2 2024
          </p>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Want to be notified when these features launch?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Notify Me
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}