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
  GridFeedCards,
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
      description:
        'Join vibrant communities for developers, gamers, crypto enthusiasts, news readers, and more. Find your tribe.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Comment,
      title: 'Chat & Connect Instantly',
      description: 'DM friends, join group chats, send voice notes, share files, and react with emojis in real-time.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: ActionsPlus,
      title: 'Earn & Customize',
      description:
        'Get premium badges, unlock custom themes, tip creators, boost your posts, and personalize your profile.',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: DeviceLaptop,
      title: 'Responsive Everywhere',
      description: 'Beautiful experience on desktop, tablet, and mobile with adaptive layouts and smooth animations.',
      color: 'from-orange-500 to-amber-500',
    },
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
          className="absolute left-10 top-20 h-72 w-72 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 opacity-30 blur-3xl dark:from-orange-800 dark:to-amber-800"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute right-10 top-40 h-96 w-96 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-20 blur-3xl dark:from-purple-800 dark:to-pink-800"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-20">
          <div className="space-y-8 text-center">
            {/* Logo/Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 inline-flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-4xl font-bold text-transparent">
                Cozy
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold leading-tight text-gray-900 dark:text-white md:text-7xl">
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
              className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl">
              Where communities feel like home. Join developers, gamers, crypto traders, and news enthusiasts in a space
              designed for authentic connection and meaningful conversations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="large"
                  className="transform bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-2xl">
                  Join Cozy Now
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  mode="secondary"
                  size="large"
                  className="border-2 border-orange-300 px-8 py-4 text-lg font-semibold text-orange-700 transition-all duration-200 hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-orange-900/20">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/50 py-24 backdrop-blur-sm dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                stay connected
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              Built for communities, designed for connection. Experience social media the cozy way.
            </p>
          </motion.div>

          {/* Interactive Features */}
          <div className="grid items-center gap-12 md:grid-cols-2">
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
                      'cursor-pointer rounded-2xl border-2 p-6 transition-all duration-500',
                      isActive
                        ? 'scale-105 border-orange-300 bg-gradient-to-r from-white to-orange-50 shadow-xl dark:from-gray-700 dark:to-orange-900/20'
                        : 'border-gray-200 bg-white/80 hover:border-orange-200 hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/80',
                    )}
                    onClick={() => setCurrentFeature(index)}>
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'rounded-xl bg-gradient-to-r p-3',
                          feature.color,
                          isActive ? 'scale-110 shadow-lg' : '',
                        )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
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
              className="relative">
              <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <div className="space-y-6">
                  {/* Feature Preview Content */}
                  {currentFeature === 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-3 text-center text-white">
                          <div className="text-lg">💻</div>
                          <div className="text-xs font-medium">Developers</div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 text-center text-white">
                          <div className="text-lg">🎮</div>
                          <div className="text-xs font-medium">Gamers</div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3 text-center text-white">
                          <div className="text-lg">₿</div>
                          <div className="text-xs font-medium">Crypto</div>
                        </div>
                        <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 p-3 text-center text-white">
                          <div className="text-lg">📰</div>
                          <div className="text-xs font-medium">News</div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400">Find your community</div>
                    </div>
                  )}

                  {currentFeature === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                        <span className="font-medium text-green-700 dark:text-green-300">Alex is typing...</span>
                      </div>
                      <div className="max-w-xs rounded-2xl rounded-bl-md bg-blue-500 p-3 text-white">
                        Check out this new feature! 🎉 <br />
                        <div className="mt-1 text-xs">🎵 voice-note.mp3</div>
                      </div>
                      <div className="ml-auto max-w-xs rounded-2xl rounded-br-md bg-gray-200 p-3 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        Love it! 😍🔥❤️
                      </div>
                    </div>
                  )}

                  {currentFeature === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 p-2 dark:from-yellow-900 dark:to-orange-900">
                          <span className="text-xl">🏆</span>
                          <span className="text-sm font-medium">Premium Badge Unlocked!</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-2 dark:from-purple-900 dark:to-pink-900">
                          <span className="text-xl">🎨</span>
                          <span className="text-sm font-medium">Dark Neon Theme Available</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 p-2 dark:from-green-900 dark:to-emerald-900">
                          <span className="text-xl">💰</span>
                          <span className="text-sm font-medium">Received 5 tips today</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentFeature === 3 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                          <DeviceLaptop className="mx-auto mb-1 h-6 w-6" />
                          <div className="text-xs">Desktop</div>
                        </div>
                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                          <div className="mx-auto mb-1 h-6 w-6 rounded bg-gray-400"></div>
                          <div className="text-xs">Tablet</div>
                        </div>
                        <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-800">
                          <div className="mx-auto mb-1 h-6 w-4 rounded bg-gray-400"></div>
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
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid gap-8 text-center text-white md:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold">10K+</div>
              <div className="text-orange-100">Active Members</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">50K+</div>
              <div className="text-orange-100">Messages Daily</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">100K+</div>
              <div className="text-orange-100">Posts Shared</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Monetization Features */}
      <div className="bg-white py-20 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Earn, Customize, and{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Stand Out
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
              Express yourself with premium features, support creators you love, and make your profile uniquely yours.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Premium Badges */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 dark:border-yellow-800 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="mb-4 text-4xl">🏆</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Premium Badges</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Get verified with a golden badge. Stand out in communities and show your commitment to the platform.
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
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
              className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 dark:border-purple-800 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="mb-4 text-4xl">🎨</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Custom Themes</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Unlock exclusive themes, animated profile frames, and custom emojis to personalize your experience.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-purple-200 px-2 py-1 text-xs text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                  Dark Neon
                </span>
                <span className="rounded bg-pink-200 px-2 py-1 text-xs text-pink-800 dark:bg-pink-800 dark:text-pink-200">
                  Gamer Pro
                </span>
                <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200">
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
              className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="mb-4 text-4xl">💰</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Tip Creators</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Support helpful posts and amazing content creators with our lightweight tipping system using Cozy coins.
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded bg-green-200 px-2 py-1 text-sm text-green-800 dark:bg-green-800 dark:text-green-200">
                  🪙 Cozy Coins
                </span>
                <span className="text-sm text-gray-500">Earn & Give</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gray-50 py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              Ready to make Cozy your{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                digital home?
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Join thousands of people building meaningful connections in a space designed for authentic community.
            </p>
            <Link href="/register">
              <Button
                size="large"
                className="transform bg-gradient-to-r from-orange-500 to-amber-500 px-12 py-5 text-xl font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-orange-600 hover:to-amber-600 hover:shadow-2xl">
                Join Cozy Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-2xl font-bold text-transparent">
                  Cozy
                </span>
              </div>
              <p className="mb-6 max-w-md leading-relaxed text-gray-300">
                Building the future of community-focused social media. Where authentic connections thrive and everyone
                feels at home.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Connect with our dev team:</span>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-gray-300 transition-colors hover:text-orange-400">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 transition-colors hover:text-orange-400">
                    Join Now
                  </Link>
                </li>
                <li>
                  <Link href="/communities" className="text-gray-300 transition-colors hover:text-orange-400">
                    Communities
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 transition-colors hover:text-orange-400">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            {/* Contact & Support */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-4">
                {/* Social Media Links */}
                <div className="space-y-3">
                  <a
                    href="https://twitter.com/cozydev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-gray-300 transition-colors hover:text-blue-400">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 transition-colors group-hover:bg-blue-600">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
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
                    className="group flex items-center gap-3 text-gray-300 transition-colors hover:text-indigo-400">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 transition-colors group-hover:bg-indigo-600">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Discord</div>
                      <div className="text-sm text-gray-400">Join our server</div>
                    </div>
                  </a>
                </div>
                {/* Additional Contact Info */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="mb-2 text-sm text-gray-400">Have questions or feedback?</p>
                  <p className="text-sm text-gray-300">
                    Reach out to us on Discord or Twitter for support, feature requests, or just to say hi!
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="mt-12 border-t border-gray-700 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-sm text-gray-400">© 2024 Cozy. Built with ❤️ for communities worldwide.</div>
              <div className="flex items-center gap-6 text-sm">
                <Link href="/privacy" className="text-gray-400 transition-colors hover:text-orange-400">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 transition-colors hover:text-orange-400">
                  Terms of Service
                </Link>
                <Link href="/help" className="text-gray-400 transition-colors hover:text-orange-400">
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
