'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextDesignStudio } from './TextDesignStudio';
import { TextDesignShop } from './TextDesignShop';
import { cn } from '@/lib/cn';

interface TextDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  type: 'post' | 'comment' | 'chat';
  targetId: string | number;
  initialStyles?: any;
  initialIframeUrl?: string;
  onSave?: (styles: any, iframeUrl?: string) => void;
}

export function TextDesignModal({
  isOpen,
  onClose,
  content,
  type,
  targetId,
  initialStyles,
  initialIframeUrl,
  onSave
}: TextDesignModalProps) {
  const [currentView, setCurrentView] = useState<'studio' | 'shop'>('studio');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSave = async (styles: any, iframeUrl?: string) => {
    try {
      const response = await fetch('/api/text-design/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          targetId,
          styles,
          iframeUrl,
        }),
      });

      if (response.ok) {
        onSave?.(styles, iframeUrl);
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save design');
      }
    } catch (error) {
      console.error('Error saving design:', error);
      alert('Failed to save design');
    }
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCurrentView('studio');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Text Design for {type.charAt(0).toUpperCase() + type.slice(1)}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentView('studio')}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      currentView === 'studio'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    🎨 Studio
                  </button>
                  <button
                    onClick={() => setCurrentView('shop')}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      currentView === 'shop'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    🛍️ Templates
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {currentView === 'studio' ? (
                <TextDesignStudio
                  content={content}
                  type={type}
                  targetId={targetId}
                  initialStyles={selectedTemplate?.styles || initialStyles}
                  initialIframeUrl={selectedTemplate?.iframeUrl || initialIframeUrl}
                  onSave={handleSave}
                  onCancel={onClose}
                />
              ) : (
                <TextDesignShop onSelectTemplate={handleSelectTemplate} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for using text design modal
export function useTextDesignModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<Partial<TextDesignModalProps>>({});

  const openModal = (props: Omit<TextDesignModalProps, 'isOpen' | 'onClose'>) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalProps({});
  };

  const Modal = () => (
    <TextDesignModal
      {...modalProps as TextDesignModalProps}
      isOpen={isOpen}
      onClose={closeModal}
    />
  );

  return {
    openModal,
    closeModal,
    Modal,
    isOpen,
  };
}