'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { useEnhancedTheme } from '@/contexts/EnhancedThemeContext';
import { useCosmetics } from '@/components/cosmetics/CosmeticProvider';
import { useUpdateProfileAndCoverPhotoClient } from '@/hooks/useUpdateProfileAndCoverPhotoClient';

interface DiscordProfileData {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  banner?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    details?: string;
  }>;
}

interface DiscordCustomizationProps {
  userId: string;
}

export function DiscordCustomization({ userId }: DiscordCustomizationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [profileData, setProfileData] = useState<DiscordProfileData | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [selectedNameplate, setSelectedNameplate] = useState('Default');
  const [customBanner, setCustomBanner] = useState<string | null>(null);
  const { showToast } = useToast();
  const { setVariant, theme } = useEnhancedTheme();
  const { getActiveCosmetic } = useCosmetics();
  const bannerUpload = useUpdateProfileAndCoverPhotoClient('cover');

  useEffect(() => {
    checkDiscordConnection();
    loadUserSettings();
  }, [userId]);

  // Update custom banner when upload completes
  useEffect(() => {
    if (bannerUpload.completedFile) {
      const newBannerUrl = bannerUpload.completedFile;
      setCustomBanner(newBannerUrl);
      
      // Save to user settings
      saveUserSettings({ customBanner: newBannerUrl });
      
      showToast({
        title: 'Banner Updated! 🎨',
        message: 'Your custom Discord banner has been uploaded',
        type: 'success'
      });
    }
  }, [bannerUpload.completedFile, showToast]);

  const loadUserSettings = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/discord-settings`);
      if (response.ok) {
        const settings = await response.json();
        setShowIframe(settings.showIframe || false);
        setSelectedNameplate(settings.selectedNameplate || 'Default');
        setCustomBanner(settings.customBanner || null);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      // Set defaults if loading fails
      setShowIframe(false);
      setSelectedNameplate('Default');
      setCustomBanner(null);
    }
  };

  const saveUserSettings = async (settings: Partial<{ showIframe: boolean; selectedNameplate: string; customBanner: string | null }>) => {
    try {
      await fetch(`/api/users/${userId}/discord-settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  };

  const checkDiscordConnection = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (response.ok) {
        const data = await response.json();
        const discordIntegration = data.integrations.find(
          (integration: any) => integration.id === 'discord'
        );
        setIsConnected(discordIntegration?.isConnected || false);
        
        if (discordIntegration?.isConnected) {
          // Mock Discord profile data - in real implementation, fetch from Discord API
          setProfileData({
            id: '123456789',
            username: discordIntegration.username || 'DiscordUser',
            discriminator: '1234',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            banner: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=200&fit=crop',
            status: 'online',
            activities: [
              {
                name: 'Building awesome apps',
                type: 0,
                details: 'on Cozy Social Platform'
              }
            ]
          });
        }
      }
    } catch (error) {
      console.error('Error checking Discord connection:', error);
    }
  };

  const handleConnectDiscord = async () => {
    try {
      const response = await fetch('/api/integrations/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: 'discord', connect: true })
      });

      if (response.ok) {
        setIsConnected(true);
        await checkDiscordConnection();
        showToast({
          title: 'Discord Connected! 🎮',
          message: 'Your Discord account is now connected',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error connecting Discord:', error);
      showToast({
        title: 'Error',
        message: 'Failed to connect Discord',
        type: 'error'
      });
    }
  };

  const handleThemeChange = async (themeVariant: string) => {
    try {
      setVariant(themeVariant as any);
      
      // Save theme preference (note: themes are usually saved in a separate user preferences API)
      await fetch(`/api/users/${userId}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeVariant })
      });
      
      showToast({
        title: 'Theme Applied! 🎨',
        message: `Switched to ${themeVariant} theme`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      showToast({
        title: 'Theme Applied',
        message: `Switched to ${themeVariant} theme (local only)`,
        type: 'warning'
      });
    }
  };

  const handleIframeToggle = async () => {
    setIframeLoading(true);
    const newValue = !showIframe;
    
    try {
      // Save the setting to database
      await saveUserSettings({ showIframe: newValue });
      
      setShowIframe(newValue);
      showToast({
        title: newValue ? 'Discord Profile Embedded! 🎮' : 'Discord Profile Hidden',
        message: newValue ? 'Your Discord profile widget is now embedded' : 'Profile iframe removed from your profile',
        type: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Failed to save iframe setting',
        type: 'error'
      });
    } finally {
      setIframeLoading(false);
    }
  };

  const handleNameplateChange = async (style: string) => {
    setSelectedNameplate(style);
    
    try {
      // Save to user settings first (always works)
      await saveUserSettings({ selectedNameplate: style });
      
      // Only attempt cosmetic application for non-default styles
      if (style !== 'Default') {
        // Apply Discord nameplate cosmetic through the cosmetics API
        const cosmeticId = `discord-nameplate-${style.toLowerCase().replace(/\s+/g, '-')}`;
        const response = await fetch('/api/cosmetics/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cosmeticId,
            isActive: true
          })
        });
        
        if (response.ok) {
          showToast({
            title: 'Nameplate Updated! ✨',
            message: `Applied ${style} nameplate style`,
            type: 'success'
          });
        } else {
          // If cosmetic doesn't exist yet, still save preference
          const errorText = await response.text();
          console.warn(`Cosmetic ${cosmeticId} not found:`, errorText);
          showToast({
            title: 'Nameplate Selected ✨',
            message: `${style} nameplate preference saved (cosmetic pending)`,
            type: 'success'
          });
        }
      } else {
        showToast({
          title: 'Nameplate Updated! ✨',
          message: 'Switched to default nameplate style',
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error applying nameplate:', error);
      showToast({
        title: 'Nameplate Selected',
        message: `${style} nameplate preference saved locally`,
        type: 'warning'
      });
    }
  };

  const discordThemes = [
    {
      id: 'discord-dark',
      name: 'Discord Dark',
      description: 'Classic Discord dark theme',
      preview: 'bg-[#36393f] text-white'
    },
    {
      id: 'discord',
      name: 'Discord Light',
      description: 'Discord light theme',
      preview: 'bg-white text-[#23272a] border border-[#e3e5e8]'
    },
    {
      id: 'default',
      name: 'Cozy Default',
      description: 'Default platform theme',
      preview: 'bg-blue-500 text-white'
    }
  ];

  const nameplateStyles = [
    { id: 'default', name: 'Default', description: 'Standard nameplate' },
    { id: 'nitro', name: 'Discord Nitro', description: 'Premium Discord style' },
    { id: 'server-booster', name: 'Server Booster', description: 'Server booster badge' },
    { id: 'hypesquad', name: 'Hypesquad', description: 'Hypesquad member badge' }
  ];

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Discord Customization</h2>
          <p className="text-muted-foreground mb-8">
            Connect your Discord account to unlock Discord themes, profile embedding, and custom banners.
          </p>
          <button
            onClick={handleConnectDiscord}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Connect Discord Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Discord Customization</h1>
        <p className="text-muted-foreground">Customize your Discord integration and themes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Discord Profile Preview */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Discord Profile</h2>
          
          {profileData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-xl overflow-hidden"
            >
              {/* Banner */}
              <div 
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${customBanner || profileData.banner})`
                }}
              >
                {!customBanner && !profileData.banner && (
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                )}
              </div>
              
              {/* Profile Info */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={profileData.avatar}
                      alt="Discord Avatar"
                      className="w-20 h-20 rounded-full border-4 border-background"
                    />
                    <div className={cn(
                      'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-background',
                      profileData.status === 'online' && 'bg-green-500',
                      profileData.status === 'idle' && 'bg-yellow-500',
                      profileData.status === 'dnd' && 'bg-red-500',
                      profileData.status === 'offline' && 'bg-gray-500'
                    )}></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">
                      {profileData.username}
                      <span className="text-muted-foreground">#{profileData.discriminator}</span>
                    </h3>
                    
                    {profileData.activities.length > 0 && (
                      <div className="mt-2">
                        {profileData.activities.map((activity, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{activity.name}</span>
                            {activity.details && (
                              <div className="text-muted-foreground">{activity.details}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Iframe Toggle */}
          <div className="bg-card border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Profile Iframe</h3>
                <p className="text-sm text-muted-foreground">
                  Embed your Discord profile in your Cozy profile
                </p>
              </div>
              <button
                onClick={handleIframeToggle}
                disabled={iframeLoading}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  showIframe ? 'bg-primary' : 'bg-muted',
                  iframeLoading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-background transition-transform',
                    showIframe ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
                {iframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {showIframe && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border rounded-lg bg-muted/50 overflow-hidden"
                >
                  {profileData && (
                    <div className="p-4">
                      {/* Real Discord Embed using Lanyard API */}
                      <div className="relative w-full">
                        <iframe
                          src={`https://lanyard.cnrad.dev/${profileData.id}?theme=dark&bg=5865f2&borderRadius=8px`}
                          width="100%"
                          height="200"
                          frameBorder="0"
                          className="rounded-lg"
                          title="Discord Presence"
                          onError={(e) => {
                            console.error('Discord iframe failed to load:', e);
                            // Fallback to static preview if iframe fails
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        
                        {/* Fallback content if iframe fails */}
                        <div 
                          className="bg-[#5865f2] p-4 rounded-lg" 
                          style={{ display: 'none' }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={profileData.avatar}
                              alt="Discord Avatar"
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <h4 className="text-white font-semibold">
                                {profileData.username}#{profileData.discriminator}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  'w-3 h-3 rounded-full',
                                  profileData.status === 'online' && 'bg-green-400',
                                  profileData.status === 'idle' && 'bg-yellow-400',
                                  profileData.status === 'dnd' && 'bg-red-400',
                                  profileData.status === 'offline' && 'bg-gray-400'
                                )}></div>
                                <span className="text-white/70 text-sm capitalize">{profileData.status}</span>
                              </div>
                            </div>
                          </div>
                          
                          {profileData.activities.map((activity, index) => (
                            <div key={index} className="bg-black/20 rounded p-3">
                              <div className="text-white/90 text-sm font-medium">{activity.name}</div>
                              {activity.details && (
                                <div className="text-white/60 text-xs">{activity.details}</div>
                              )}
                            </div>
                          ))}
                          
                          <p className="text-xs text-white/60 mt-2">
                            ⚠️ Live embed unavailable - showing static preview
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        🔄 Live Discord status embed - updates in real-time
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Theme Customization */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Discord Themes</h2>
          
          <div className="space-y-4">
            {discordThemes.map((themeOption) => (
              <motion.div
                key={themeOption.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  'border rounded-xl p-4 cursor-pointer transition-all',
                  theme.variant === themeOption.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                )}
                onClick={() => handleThemeChange(themeOption.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-lg', themeOption.preview)}></div>
                  <div className="flex-1">
                    <h3 className="font-medium">{themeOption.name}</h3>
                    <p className="text-sm text-muted-foreground">{themeOption.description}</p>
                  </div>
                  {theme.variant === themeOption.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">✓</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Banner Upload */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Custom Banner</h3>
            <div className="space-y-4">
              <button
                onClick={bannerUpload.openInput}
                disabled={bannerUpload.isPending}
                className={cn(
                  'w-full px-4 py-3 border-2 border-dashed rounded-lg transition-colors',
                  'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary',
                  bannerUpload.isPending && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📸</span>
                  <span className="text-sm font-medium">
                    {bannerUpload.isPending ? 'Uploading...' : 'Upload Banner Image'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Click to upload a custom banner for your Discord profile
                  </span>
                </div>
              </button>
              
              <input
                ref={bannerUpload.inputFileRef}
                type="file"
                name="cover"
                accept="image/*"
                onChange={bannerUpload.handleChange}
                className="hidden"
              />
              
              <p className="text-xs text-muted-foreground">
                Recommended size: 960x540 pixels. Max file size: 10MB
              </p>
            </div>
          </div>

          {/* Nameplate Customization */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Discord Nameplate Style</h3>
            <div className="space-y-3">
              {nameplateStyles.map((style) => (
                <motion.div
                  key={style.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-all',
                    selectedNameplate === style.name
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => handleNameplateChange(style.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                    {selectedNameplate === style.name && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Nameplate styles will appear throughout the platform when you comment or post
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}