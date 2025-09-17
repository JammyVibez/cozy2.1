
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import { CommunityTemplateSelector } from './CommunityTemplateSelector';
import { CommunityDragDropEditor } from './CommunityDragDropEditor';
import { CommunityBotMarketplace } from './CommunityBotMarketplace';
import Button from './ui/Button';

type WizardStep = 'method' | 'template' | 'customize' | 'bots' | 'review';

interface CommunityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  price: number;
  popularity: number;
}

interface CommunityComponent {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  config: Record<string, any>;
  enabled: boolean;
}

export function CommunityCreationWizard() {
  const [step, setStep] = useState<WizardStep>('method');
  const [creationMethod, setCreationMethod] = useState<'template' | 'custom' | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunityTemplate | null>(null);
  const [communityComponents, setCommunityComponents] = useState<CommunityComponent[]>([]);
  const [communityStyles, setCommunityStyles] = useState<Record<string, any>>({});
  const [selectedBots, setSelectedBots] = useState<string[]>([]);
  const [communityData, setCommunityData] = useState({
    name: '',
    description: '',
    category: '',
    isPublic: true,
  });

  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const createCommunityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/communities/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create community');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      showToast({ 
        title: 'Community Created!', 
        message: `${data.community.name} is ready for members`,
        type: 'success' 
      });
      router.push(`/communities/${data.community.id}`);
    },
    onError: (error: Error) => {
      showToast({ 
        title: 'Error', 
        message: error.message, 
        type: 'error' 
      });
    },
  });

  const steps: { id: WizardStep; title: string; description: string }[] = [
    { id: 'method', title: 'Choose Method', description: 'How do you want to create your community?' },
    { id: 'template', title: 'Select Template', description: 'Pick a template that fits your community' },
    { id: 'customize', title: 'Customize Layout', description: 'Design your community interface' },
    { id: 'bots', title: 'Add Bots', description: 'Enhance with bots and integrations' },
    { id: 'review', title: 'Review & Create', description: 'Final review before creating' },
  ];

  const getActiveSteps = () => {
    if (creationMethod === 'template') {
      return steps.filter(s => ['method', 'template', 'bots', 'review'].includes(s.id));
    }
    return steps;
  };

  const activeSteps = getActiveSteps();
  const currentStepIndex = activeSteps.findIndex(s => s.id === step);

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < activeSteps.length) {
      setStep(activeSteps[nextIndex].id);
    }
  }, [currentStepIndex, activeSteps]);

  const prevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(activeSteps[prevIndex].id);
    }
  }, [currentStepIndex, activeSteps]);

  const canProceed = () => {
    switch (step) {
      case 'method':
        return creationMethod !== null;
      case 'template':
        return selectedTemplate !== null;
      case 'customize':
        return communityComponents.length > 0;
      case 'bots':
        return true; // Optional step
      case 'review':
        return communityData.name.trim() !== '' && communityData.category !== '';
      default:
        return false;
    }
  };

  const handleTemplateSelect = (template: CommunityTemplate) => {
    setSelectedTemplate(template);
    setCommunityData(prev => ({
      ...prev,
      category: template.category,
    }));
  };

  const handleBotInstall = (botId: string, permissions: string[]) => {
    setSelectedBots(prev => [...prev, botId]);
  };

  const handleCreateCommunity = () => {
    const data = {
      ...communityData,
      template: selectedTemplate?.id,
      components: communityComponents,
      styles: communityStyles,
      bots: selectedBots,
      creationMethod,
    };

    createCommunityMutation.mutate(data);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {activeSteps.map((s, index) => (
            <div
              key={s.id}
              className={cn(
                'flex items-center',
                index < activeSteps.length - 1 && 'flex-1'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium',
                  index <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              {index < activeSteps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">{activeSteps[currentStepIndex]?.title}</h1>
          <p className="text-muted-foreground">{activeSteps[currentStepIndex]?.description}</p>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {step === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <button
                onClick={() => setCreationMethod('template')}
                className={cn(
                  'p-8 rounded-xl border-2 transition-all duration-200 text-left',
                  'hover:scale-[1.02] hover:shadow-lg',
                  creationMethod === 'template'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">Use Template</h3>
                <p className="text-muted-foreground mb-4">
                  Start with a pre-built template designed for your community type. 
                  Perfect for getting started quickly with proven layouts.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                    Fast Setup
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                    Proven Layouts
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                    Built-in Features
                  </span>
                </div>
              </button>

              <button
                onClick={() => setCreationMethod('custom')}
                className={cn(
                  'p-8 rounded-xl border-2 transition-all duration-200 text-left',
                  'hover:scale-[1.02] hover:shadow-lg',
                  creationMethod === 'custom'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="text-6xl mb-4">🛠️</div>
                <h3 className="text-xl font-bold mb-2">Custom Build</h3>
                <p className="text-muted-foreground mb-4">
                  Build your community from scratch with full customization. 
                  Drag and drop components to create exactly what you envision.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                    Full Control
                  </span>
                  <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-xs">
                    Drag & Drop
                  </span>
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                    Unique Design
                  </span>
                </div>
              </button>
            </motion.div>
          )}

          {step === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CommunityTemplateSelector
                onTemplateSelect={handleTemplateSelect}
                selectedTemplate={selectedTemplate?.id}
              />
            </motion.div>
          )}

          {step === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CommunityDragDropEditor
                initialComponents={communityComponents}
                onComponentsChange={setCommunityComponents}
                onStyleChange={setCommunityStyles}
              />
            </motion.div>
          )}

          {step === 'bots' && (
            <motion.div
              key="bots"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CommunityBotMarketplace
                communityId=""
                installedBots={selectedBots}
                onBotInstall={handleBotInstall}
              />
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-bold">Community Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Community Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={communityData.name}
                      onChange={(e) => setCommunityData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter community name..."
                      className="w-full px-4 py-2 border rounded-lg bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={communityData.category}
                      onChange={(e) => setCommunityData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg bg-background"
                    >
                      <option value="">Select category...</option>
                      <option value="TECHNOLOGY">Technology</option>
                      <option value="GAMING">Gaming</option>
                      <option value="CRYPTOCURRENCY">Cryptocurrency</option>
                      <option value="ART">Art</option>
                      <option value="EDUCATION">Education</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={communityData.description}
                    onChange={(e) => setCommunityData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your community..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg bg-background resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={communityData.isPublic}
                    onChange={(e) => setCommunityData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Make this community public (anyone can discover and join)
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedTemplate && (
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Template</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedTemplate.preview}</span>
                      <span className="text-sm">{selectedTemplate.name}</span>
                    </div>
                  </div>
                )}

                {communityComponents.length > 0 && (
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Components</h3>
                    <div className="text-sm text-muted-foreground">
                      {communityComponents.length} custom components configured
                    </div>
                  </div>
                )}

                {selectedBots.length > 0 && (
                  <div className="bg-card border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Bots</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedBots.length} bot{selectedBots.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          onPress={prevStep}
          mode="secondary"
          disabled={currentStepIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center gap-3">
          {currentStepIndex < activeSteps.length - 1 ? (
            <Button
              onPress={nextStep}
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button
              onPress={handleCreateCommunity}
              loading={createCommunityMutation.isPending}
              disabled={!canProceed()}
            >
              Create Community
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
