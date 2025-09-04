'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/Switch';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { Profile, TwoPeople, Hide, WorldNet } from '@/svg_components';

interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  showEmail: boolean;
  showPhoneNumber: boolean;
  allowTagging: boolean;
  allowDirectMessages: 'everyone' | 'followers' | 'none';
  showOnlineStatus: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
  dataDownload: boolean;
  activityStatus: boolean;
  readReceipts: boolean;
}

export function PrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhoneNumber: false,
    allowTagging: true,
    allowDirectMessages: 'followers',
    showOnlineStatus: true,
    allowSearchByEmail: false,
    allowSearchByPhone: false,
    dataDownload: true,
    activityStatus: true,
    readReceipts: true,
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch('/api/user/privacy-settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    }
  };

  const updateSetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/user/privacy-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const SettingSection = ({ 
    title, 
    description, 
    children 
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const ToggleSetting = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-start justify-between p-4 bg-card rounded-lg border">
      <div className="flex-1 space-y-1">
        <label className="text-sm font-medium cursor-pointer">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch isSelected={checked} onChange={onChange} />
    </div>
  );

  const RadioSetting = ({
    label,
    description,
    value,
    options,
    onChange,
  }: {
    label: string;
    description?: string;
    value: string;
    options: { value: string; label: string; description?: string }[];
    onChange: (value: string) => void;
  }) => (
    <div className="p-4 bg-card rounded-lg border space-y-3">
      <div>
        <h4 className="text-sm font-medium">{label}</h4>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors"
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{option.label}</div>
              {option.description && (
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Privacy Settings</h1>
        <p className="text-muted-foreground">
          Control who can see your information and how you interact with others
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Visibility */}
        <SettingSection
          title="Profile Visibility"
          description="Control who can see your profile information"
        >
          <RadioSetting
            label="Who can see your profile"
            value={settings.profileVisibility}
            onChange={(value) => updateSetting('profileVisibility', value as any)}
            options={[
              {
                value: 'public',
                label: 'Public',
                description: 'Anyone can see your profile',
              },
              {
                value: 'followers',
                label: 'Followers only',
                description: 'Only people who follow you can see your profile',
              },
              {
                value: 'private',
                label: 'Private',
                description: 'Only you can see your profile',
              },
            ]}
          />

          <ToggleSetting
            label="Show email address"
            description="Let others see your email address on your profile"
            checked={settings.showEmail}
            onChange={(checked) => updateSetting('showEmail', checked)}
          />

          <ToggleSetting
            label="Show phone number"
            description="Let others see your phone number on your profile"
            checked={settings.showPhoneNumber}
            onChange={(checked) => updateSetting('showPhoneNumber', checked)}
          />
        </SettingSection>

        {/* Interactions */}
        <SettingSection
          title="Interactions"
          description="Control how others can interact with you"
        >
          <RadioSetting
            label="Who can send you direct messages"
            value={settings.allowDirectMessages}
            onChange={(value) => updateSetting('allowDirectMessages', value as any)}
            options={[
              {
                value: 'everyone',
                label: 'Everyone',
                description: 'Anyone can send you messages',
              },
              {
                value: 'followers',
                label: 'People you follow',
                description: 'Only people you follow can message you',
              },
              {
                value: 'none',
                label: 'No one',
                description: 'Disable direct messages completely',
              },
            ]}
          />

          <ToggleSetting
            label="Allow tagging in posts"
            description="Let others tag you in their posts and comments"
            checked={settings.allowTagging}
            onChange={(checked) => updateSetting('allowTagging', checked)}
          />

          <ToggleSetting
            label="Show online status"
            description="Let others see when you're online"
            checked={settings.showOnlineStatus}
            onChange={(checked) => updateSetting('showOnlineStatus', checked)}
          />

          <ToggleSetting
            label="Show activity status"
            description="Let others see your recent activity"
            checked={settings.activityStatus}
            onChange={(checked) => updateSetting('activityStatus', checked)}
          />

          <ToggleSetting
            label="Read receipts"
            description="Let others know when you've read their messages"
            checked={settings.readReceipts}
            onChange={(checked) => updateSetting('readReceipts', checked)}
          />
        </SettingSection>

        {/* Discoverability */}
        <SettingSection
          title="Discoverability"
          description="Control how others can find you"
        >
          <ToggleSetting
            label="Allow search by email"
            description="Let others find you using your email address"
            checked={settings.allowSearchByEmail}
            onChange={(checked) => updateSetting('allowSearchByEmail', checked)}
          />

          <ToggleSetting
            label="Allow search by phone number"
            description="Let others find you using your phone number"
            checked={settings.allowSearchByPhone}
            onChange={(checked) => updateSetting('allowSearchByPhone', checked)}
          />
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection
          title="Data & Privacy"
          description="Manage your data and privacy preferences"
        >
          <ToggleSetting
            label="Allow data download"
            description="Enable the ability to download your data"
            checked={settings.dataDownload}
            onChange={(checked) => updateSetting('dataDownload', checked)}
          />
        </SettingSection>
      </div>

      {/* Save Changes */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-card border rounded-lg shadow-lg p-4 flex items-center gap-4">
            <span className="text-sm">You have unsaved changes</span>
            <Button
              onPress={saveSettings}
              loading={saving}
              size="small"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}