'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Cosmetic {
  id: string;
  type: 'THEME' | 'BANNER' | 'NAMEPLATE' | 'PFP_FRAME';
  name: string;
  preview: string;
  assetUrl: string;
  metadata?: any;
  isApplied: boolean;
  isActive: boolean;
}

const COSMETIC_TYPES = [
  { key: 'ALL', label: 'All Items', icon: '🌟' },
  { key: 'THEME', label: 'Themes', icon: '🎨' },
  { key: 'BANNER', label: 'Banners', icon: '🏷️' },
  { key: 'NAMEPLATE', label: 'Nameplates', icon: '💎' },
  { key: 'PFP_FRAME', label: 'Profile Frames', icon: '🖼️' }
];

export default function ShopPage() {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [filteredCosmetics, setFilteredCosmetics] = useState<Cosmetic[]>([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Fetch cosmetics
  useEffect(() => {
    fetchCosmetics();
  }, []);

  // Filter cosmetics by type
  useEffect(() => {
    if (selectedType === 'ALL') {
      setFilteredCosmetics(cosmetics);
    } else {
      setFilteredCosmetics(cosmetics.filter(c => c.type === selectedType));
    }
  }, [cosmetics, selectedType]);

  const fetchCosmetics = async () => {
    try {
      const response = await fetch('/api/cosmetics');
      const data = await response.json();
      setCosmetics(data.cosmetics || []);
    } catch (error) {
      console.error('Error fetching cosmetics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCosmetic = async (cosmeticId: string, currentlyActive: boolean) => {
    setApplyingId(cosmeticId);
    try {
      const response = await fetch('/api/cosmetics/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cosmeticId,
          isActive: !currentlyActive 
        })
      });

      if (response.ok) {
        // Refresh cosmetics to get updated state
        await fetchCosmetics();
      } else {
        console.error('Error applying cosmetic');
      }
    } catch (error) {
      console.error('Error applying cosmetic:', error);
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Cosmetics{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Shop
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Customize your profile with themes, banners, nameplates, and profile frames
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {COSMETIC_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              className={cn(
                'px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2',
                selectedType === type.key
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              )}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </motion.div>

        {/* Cosmetics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCosmetics.map((cosmetic, index) => (
            <motion.div
              key={cosmetic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <img
                  src={cosmetic.preview}
                  alt={cosmetic.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-cosmetic.svg';
                  }}
                />
                {cosmetic.isActive && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Active
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {cosmetic.type === 'THEME' && '🎨'}
                    {cosmetic.type === 'BANNER' && '🏷️'}
                    {cosmetic.type === 'NAMEPLATE' && '💎'}
                    {cosmetic.type === 'PFP_FRAME' && '🖼️'}
                  </span>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                    {cosmetic.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {cosmetic.name}
                </h3>

                <button
                  onClick={() => handleApplyCosmetic(cosmetic.id, cosmetic.isActive)}
                  disabled={applyingId === cosmetic.id}
                  className={cn(
                    'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200',
                    cosmetic.isActive
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : cosmetic.isApplied
                      ? 'bg-gray-500 hover:bg-gray-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white',
                    applyingId === cosmetic.id && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {applyingId === cosmetic.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : cosmetic.isActive ? (
                    'Remove'
                  ) : cosmetic.isApplied ? (
                    'Apply'
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCosmetics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No cosmetics found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedType === 'ALL' 
                ? 'No cosmetics are available yet.' 
                : `No ${selectedType.toLowerCase()} cosmetics available.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}