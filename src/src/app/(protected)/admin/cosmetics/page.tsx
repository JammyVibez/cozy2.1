'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface CosmeticFormData {
  type: 'THEME' | 'BANNER' | 'NAMEPLATE' | 'PFP_FRAME';
  name: string;
  preview: string;
  assetUrl: string;
  metadata: Record<string, any>;
}

const COSMETIC_TYPES = [
  { value: 'THEME', label: 'Theme', icon: '🎨' },
  { value: 'BANNER', label: 'Banner', icon: '🏷️' },
  { value: 'NAMEPLATE', label: 'Nameplate', icon: '💎' },
  { value: 'PFP_FRAME', label: 'Profile Frame', icon: '🖼️' }
];

export default function AdminCosmeticsPage() {
  const [formData, setFormData] = useState<CosmeticFormData>({
    type: 'THEME',
    name: '',
    preview: '',
    assetUrl: '',
    metadata: {}
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof CosmeticFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cosmetics/admin/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Cosmetic added successfully!' });
        setFormData({
          type: 'THEME',
          name: '',
          preview: '',
          assetUrl: '',
          metadata: {}
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add cosmetic' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while adding the cosmetic' });
    } finally {
      setLoading(false);
    }
  };

  // GitHub URL generator
  const generateGitHubUrl = (filename: string) => {
    const baseUrl = 'https://raw.githubusercontent.com/JammyVibez/discord-fake-avatar-decorations/main/public';
    
    switch (formData.type) {
      case 'THEME':
        return `${baseUrl}/themes/${filename}`;
      case 'BANNER':
        return `${baseUrl}/banners/${filename}`;
      case 'NAMEPLATE':
        return `${baseUrl}/nameplate/${filename}`;
      case 'PFP_FRAME':
        return `${baseUrl}/frames/${filename}`;
      default:
        return `${baseUrl}/${filename}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Admin{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Cosmetics
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Add new cosmetics to the shop
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Cosmetic Type
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {COSMETIC_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2',
                      formData.type === type.value
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                    )}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter cosmetic name"
                required
              />
            </div>

            {/* Preview URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview Image URL
              </label>
              <input
                type="url"
                value={formData.preview}
                onChange={(e) => handleInputChange('preview', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://raw.githubusercontent.com/..."
                required
              />
            </div>

            {/* Asset URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Asset URL (CSS/SVG/etc.)
              </label>
              <input
                type="url"
                value={formData.assetUrl}
                onChange={(e) => handleInputChange('assetUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://raw.githubusercontent.com/..."
                required
              />
            </div>

            {/* GitHub Helper */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                💡 GitHub URL Helper
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                Enter a filename and we'll generate the GitHub raw URL:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="filename.svg"
                  className="flex-1 px-3 py-2 border border-blue-200 dark:border-blue-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                  onChange={(e) => {
                    const url = generateGitHubUrl(e.target.value);
                    if (e.target.value) {
                      handleInputChange('assetUrl', url);
                      handleInputChange('preview', url);
                    }
                  }}
                />
              </div>
            </div>

            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Metadata (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.metadata, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleInputChange('metadata', parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white h-32"
                placeholder='{"colors": {"primary": "#ff6b35"}, "style": "neon"}'
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200',
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              )}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Cosmetic...
                </div>
              ) : (
                'Add Cosmetic'
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mt-6 p-4 rounded-lg',
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-600'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-600'
              )}
            >
              {message.text}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}