'use client';

import { motion } from 'framer-motion';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { cn } from '@/lib/cn';
import { Heart, Comment, DeviceLaptop, TwoPeople, ActionsPlus, WorldNet } from '@/svg_components';

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
  const { theme } = useEnhancedTheme();
  const { variant, actualMode } = theme;

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
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center p-6",
        "bg-gradient-to-br from-background via-muted/20 to-background",
        `theme-${variant}-coming-soon`,
        actualMode,
        className
      )}
      data-theme={variant}
    >
      <motion.div
        className={cn(
          "max-w-4xl w-full text-center space-y-8",
          "bg-card/60 backdrop-blur-sm border border-border/40 rounded-3xl p-8 md:p-12",
          "shadow-2xl",
          `theme-${variant}-card`
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        data-theme={variant}
      >
        {/* Animated Icon */}
        <motion.div
          className="relative"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center space-x-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={cn(
                "p-4 rounded-full",
                "bg-gradient-to-r from-primary/20 to-accent/20",
                "border border-primary/30"
              )}
            >
              <TwoPeople className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "p-4 rounded-full",
                "bg-gradient-to-r from-accent/20 to-primary/20", 
                "border border-accent/30"
              )}
            >
              <Comment className="w-12 h-12 text-accent-foreground" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className={cn(
            "text-4xl md:text-6xl font-bold",
            "bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent",
            `theme-${variant}-heading`
          )}
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className={cn(
            "text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto",
            `theme-${variant}-text`
          )}
          variants={itemVariants}
        >
          {description}
        </motion.p>

        {/* Construction Animation */}
        <motion.div
          className="flex justify-center space-x-2 py-4"
          variants={itemVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.5 
              }}
              className="text-4xl"
            >
              🚧
            </motion.div>
          ))}
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 mt-12"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl",
                "bg-muted/40 border border-border/20",
                "text-left",
                `theme-${variant}-feature-item`
              )}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              data-theme={variant}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                "bg-primary/20 text-primary"
              )}>
                <span className="text-sm font-bold">✓</span>
              </div>
              <span className="text-foreground font-medium">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          className={cn(
            "mt-12 p-6 rounded-2xl",
            "bg-gradient-to-r from-primary/10 to-accent/10",
            "border border-primary/20",
            `theme-${variant}-timeline`
          )}
          variants={itemVariants}
          data-theme={variant}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Development Timeline</h3>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-foreground">Phase 1</div>
              <div className="text-sm text-muted-foreground">Chat Rooms</div>
              <div className="text-xs text-primary font-medium">Q1 2025</div>
            </div>
            <div className="hidden md:block w-8 h-0.5 bg-border"></div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛠️</div>
              <div className="font-semibold text-foreground">Phase 2</div>
              <div className="text-sm text-muted-foreground">Moderation Tools</div>
              <div className="text-xs text-muted-foreground">Q2 2025</div>
            </div>
            <div className="hidden md:block w-8 h-0.5 bg-border"></div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold text-foreground">Phase 3</div>
              <div className="text-sm text-muted-foreground">Advanced Features</div>
              <div className="text-xs text-muted-foreground">Q3 2025</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="pt-8"
          variants={itemVariants}
        >
          <motion.button
            className={cn(
              "px-8 py-4 rounded-xl font-semibold text-lg",
              "bg-gradient-to-r from-primary to-accent",
              "text-primary-foreground shadow-lg",
              "transition-all duration-200",
              `theme-${variant}-cta-button`
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-theme={variant}
          >
            Stay Updated 📬
          </motion.button>
          <p className="mt-4 text-sm text-muted-foreground">
            Get notified when these features become available
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}