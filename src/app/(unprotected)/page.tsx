'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import Button from '@/components/ui/Button';
import { 
  Heart, 
  TwoPeople, 
  Comment, 
  ActionsPlus,
  DeviceLaptop,
  WorldNet,
  Search,
  GridFeedCards
} from '@/svg_components';

export default function LandingPage() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const features = [
    {
      icon: TwoPeople,
      title: 'Explore Communities',
      description: 'Join vibrant communities for developers, gamers, crypto enthusiasts, news readers, and more. Find your tribe.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Comment,
      title: 'Chat & Connect Instantly',
      description: 'DM friends, join group chats, send voice notes, share files, and react with emojis in real-time.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: ActionsPlus,
      title: 'Earn & Customize',
      description: 'Get premium badges, unlock custom themes, tip creators, boost your posts, and personalize your profile.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: DeviceLaptop,
      title: 'Responsive Everywhere',
      description: 'Beautiful experience on desktop, tablet, and mobile with adaptive layouts and smooth animations.',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800 dark:to-amber-800 rounded-full blur-3xl opacity-30"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full blur-3xl opacity-20"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center space-y-8">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Cozy
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Your space to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                connect
              </span>
              <br />
              and feel at home online
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Where communities feel like home. Join developers, gamers, crypto traders, and news enthusiasts 
              in a space designed for authentic connection and meaningful conversations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
              <Link href="/register">
                <Button
                  size="large" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Join Cozy Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  mode="secondary"
                  size="large"
                  className="border-2 border-orange-300 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-8 py-4 text-lg font-semibold transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                stay connected
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built for communities, designed for connection. Experience social media the cozy way.
            </p>
          </motion.div>

          {/* Interactive Features */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = currentFeature === index;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={cn(
                      'p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer',
                      isActive 
                        ? 'bg-gradient-to-r from-white to-orange-50 dark:from-gray-700 dark:to-orange-900/20 border-orange-300 shadow-xl scale-105' 
                        : 'bg-white/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 hover:border-orange-200 hover:shadow-lg'
                    )}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-3 rounded-xl bg-gradient-to-r',
                        feature.color,
                        isActive ? 'shadow-lg scale-110' : ''
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Feature Preview */}
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  {/* Feature Preview Content */}
                  {currentFeature === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white text-center">
                          <div className="text-lg">💻</div>
                          <div className="text-xs font-medium">Developers</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-center">
                          <div className="text-lg">🎮</div>
                          <div className="text-xs font-medium">Gamers</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-white text-center">
                          <div className="text-lg">₿</div>
                          <div className="text-xs font-medium">Crypto</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center">
                          <div className="text-lg">📰</div>
                          <div className="text-xs font-medium">News</div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Find your community
                      </div>
                    </div>
                  )}

                  {currentFeature === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-700 dark:text-green-300 font-medium">Alex is typing...</span>
                      </div>
                      <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-bl-md max-w-xs">
                        Check out this new feature! 🎉 <br/>
                        <div className="text-xs mt-1">🎵 voice-note.mp3</div>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-br-md max-w-xs ml-auto">
                        Love it! 😍🔥❤️
                      </div>
                    </div>
                  )}

                  {currentFeature === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg">
                          <span className="text-xl">🏆</span>
                          <span className="text-sm font-medium">Premium Badge Unlocked!</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                          <span className="text-xl">🎨</span>
                          <span className="text-sm font-medium">Dark Neon Theme Available</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg">
                          <span className="text-xl">💰</span>
                          <span className="text-sm font-medium">Received 5 tips today</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature === 3 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <DeviceLaptop className="w-6 h-6 mx-auto mb-1" />
                          <div className="text-xs">Desktop</div>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="w-6 h-6 mx-auto mb-1 bg-gray-400 rounded"></div>
                          <div className="text-xs">Tablet</div>
                        </div>
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="w-4 h-6 mx-auto mb-1 bg-gray-400 rounded"></div>
                          <div className="text-xs">Mobile</div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Seamless across all devices
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 text-center text-white"
          >
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-orange-100">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">Messages Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-orange-100">Posts Shared</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Developer Ecosystem Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Built for{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A modular, template-driven platform with a powerful plugin ecosystem. Create custom communities with templates, bots, and extensible imports.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Template Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
            >
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Template Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Choose from pre-built templates or create your own. Study groups, gaming clans, dev teams - all with drag-and-drop customization.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Study Group
                </span>
                <span className="text-xs bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">
                  Gaming Clan
                </span>
                <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  Dev Team
                </span>
              </div>
            </motion.div>

            {/* Bot Ecosystem */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Bot Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Extend communities with powerful bots. Moderation, games, integrations - all with secure permission scopes and sandboxed execution.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  JS/Python SDK
                </span>
                <span className="text-xs bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-2 py-1 rounded">
                  Secure Runtime
                </span>
              </div>
            </motion.div>

            {/* Custom Imports */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800"
            >
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Custom Imports</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Import custom packages to completely transform your community. Full developer control with safety-first sandboxing.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  🔒 Sandboxed
                </span>
                <span className="text-sm text-gray-500">Coming Soon</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Monetization Features */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Earn, Customize, and{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Stand Out
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Express yourself with premium features, support creators you love, and make your profile uniquely yours.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Premium Badges */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Premium Badges</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get verified with a golden badge. Stand out in communities and show your commitment to the platform.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                  ✨ Verified
                </span>
                <span className="text-sm text-gray-500">Starting at $2.99</span>
              </div>
            </motion.div>

            {/* Custom Themes */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Custom Themes</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Unlock exclusive themes, animated profile frames, and custom emojis to personalize your experience.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  Dark Neon
                </span>
                <span className="text-xs bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-2 py-1 rounded">
                  Gamer Pro
                </span>
                <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Minimal
                </span>
              </div>
            </motion.div>

            {/* Tipping System */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg"
            >
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tip Creators</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Support helpful posts and amazing content creators with our lightweight tipping system using Cozy coins.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  🪙 Cozy Coins
                </span>
                <span className="text-sm text-gray-500">Earn & Give</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Ready to make Cozy your{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                digital home?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of people building meaningful connections in a space designed for authentic community.
            </p>
            <Link href="/register">
              <Button
                size="large"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-12 py-5 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Join Cozy Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Cozy
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Building the future of community-focused social media. Where authentic connections thrive and everyone feels at home.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Connect with our dev team:</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-orange-400 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-orange-400 transition-colors">
                    Join Now
                  </Link>
                </li>
                <li>
                  <Link href="/communities" className="text-gray-300 hover:text-orange-400 transition-colors">
                    Communities
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {/* Social Media Links */}
                <div className="space-y-3">
                  <a
                    href="https://twitter.com/cozydev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Twitter</div>
                      <div className="text-sm text-gray-400">@cozydev</div>
                    </div>
                  </a>

                  <a
                    href="https://discord.gg/cozydev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-300 hover:text-indigo-400 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Discord</div>
                      <div className="text-sm text-gray-400">Join our server</div>
                    </div>
                  </a>
                </div>

                {/* Additional Contact Info */}
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Have questions or feedback?</p>
                  <p className="text-sm text-gray-300">
                    Reach out to us on Discord or Twitter for support, feature requests, or just to say hi!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2024 Cozy. Built with ❤️ for communities worldwide.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="/help" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
