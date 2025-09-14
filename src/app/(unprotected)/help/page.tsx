
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ActionsPlus, TwoPeople, Comment, Heart } from '@/svg_components';

const helpCategories = [
  {
    icon: '🚀',
    title: 'Getting Started',
    description: 'Learn the basics of using Cozy',
    articles: [
      'Creating your first account',
      'Setting up your profile',
      'Joining your first community',
      'Making your first post',
      'Understanding reactions and comments'
    ]
  },
  {
    icon: '👥',
    title: 'Communities',
    description: 'Everything about creating and managing communities',
    articles: [
      'Creating a community',
      'Community roles and permissions',
      'Managing members',
      'Community customization',
      'Using community templates'
    ]
  },
  {
    icon: '💬',
    title: 'Communication',
    description: 'Posts, comments, and messaging features',
    articles: [
      'Creating posts with media',
      'Using mentions and hashtags',
      'Direct messaging',
      'Emoji reactions',
      'Real-time notifications'
    ]
  },
  {
    icon: '🔒',
    title: 'Privacy & Safety',
    description: 'Keep your account and data secure',
    articles: [
      'Privacy settings overview',
      'Blocking and reporting users',
      'Content moderation',
      'Two-factor authentication',
      'Data export and deletion'
    ]
  },
  {
    icon: '⚙️',
    title: 'Account Settings',
    description: 'Manage your account preferences',
    articles: [
      'Changing your username',
      'Email and password settings',
      'Notification preferences',
      'Theme customization',
      'Deleting your account'
    ]
  },
  {
    icon: '🛠️',
    title: 'Developers',
    description: 'API, bots, and extensibility',
    articles: [
      'Getting started with the API',
      'Creating community templates',
      'Building bots with our SDK',
      'Plugin development guide',
      'Marketplace submission process'
    ]
  }
];

const featuredArticles = [
  {
    title: 'How to create your first community',
    description: 'Step-by-step guide to setting up and customizing your community space',
    category: 'Getting Started',
    readTime: '5 min read'
  },
  {
    title: 'Understanding community roles and permissions',
    description: 'Learn about owner, moderator, and member roles in communities',
    category: 'Communities',
    readTime: '3 min read'
  },
  {
    title: 'Privacy settings and data control',
    description: 'Take control of your privacy with our comprehensive settings',
    category: 'Privacy & Safety',
    readTime: '4 min read'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How can we help you?
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Find answers, get support, and learn everything you need to know about Cozy
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 bg-white text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-orange-300 focus:outline-none"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Featured Articles */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Popular Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {article.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Help Categories */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category.title ? null : category.title)}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                
                {selectedCategory === category.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {category.articles.map((article, articleIndex) => (
                      <div
                        key={articleIndex}
                        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer py-1"
                      >
                        • {article}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Support */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl text-orange-100 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
              Join Community Discord
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
