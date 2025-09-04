'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';

interface TextDesignStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  textAlign?: string;
  textShadow?: string;
  boxShadow?: string;
  gradient?: string;
  animation?: string;
  customCSS?: string;
}

interface TextDesignStudioProps {
  content: string;
  type: 'post' | 'comment' | 'chat';
  targetId: string | number;
  initialStyles?: TextDesignStyles;
  initialIframeUrl?: string;
  onSave?: (styles: TextDesignStyles, iframeUrl?: string) => void;
  onCancel?: () => void;
  className?: string;
}

const FONT_FAMILIES = [
  'Inter', 'Poppins', 'Roboto', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman',
  'Courier New', 'monospace', 'cursive', 'fantasy'
];

const FONT_SIZES = [
  '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'
];

const FONT_WEIGHTS = [
  { label: 'Light', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' },
];

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
];

const ANIMATION_PRESETS = [
  'none',
  'pulse 2s infinite',
  'bounce 1s infinite',
  'shake 0.5s infinite',
  'glow 2s ease-in-out infinite alternate',
  'fade-in 1s ease-in',
  'slide-in 0.5s ease-out',
  'rainbow 3s linear infinite'
];

export function TextDesignStudio({
  content,
  type,
  targetId,
  initialStyles = {},
  initialIframeUrl = '',
  onSave,
  onCancel,
  className
}: TextDesignStudioProps) {
  const [styles, setStyles] = useState<TextDesignStyles>(initialStyles);
  const [iframeUrl, setIframeUrl] = useState(initialIframeUrl);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'iframe'>('basic');
  const [previewMode, setPreviewMode] = useState(false);

  // Generate CSS from styles object
  const generateCSS = useCallback((styleObj: TextDesignStyles) => {
    const cssRules: string[] = [];
    
    Object.entries(styleObj).forEach(([key, value]) => {
      if (value && key !== 'customCSS') {
        const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        cssRules.push(`${cssProperty}: ${value}`);
      }
    });

    if (styleObj.customCSS) {
      cssRules.push(styleObj.customCSS);
    }

    return cssRules.join('; ');
  }, []);

  const updateStyle = (property: keyof TextDesignStyles, value: string) => {
    setStyles(prev => ({ ...prev, [property]: value }));
  };

  const handleSave = () => {
    onSave?.(styles, iframeUrl);
  };

  const applyPreset = (preset: 'neon' | 'gaming' | 'elegant' | 'fun') => {
    const presets = {
      neon: {
        color: '#00ffff',
        backgroundColor: '#000011',
        textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        border: '2px solid #00ffff',
        borderRadius: '8px',
        padding: '12px',
        fontWeight: '600',
      },
      gaming: {
        color: '#00ff41',
        backgroundColor: '#0d1117',
        fontFamily: 'Courier New',
        border: '2px solid #00ff41',
        borderRadius: '4px',
        padding: '10px',
        textShadow: '0 0 5px #00ff41',
      },
      elegant: {
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        fontFamily: 'Georgia',
        fontSize: '18px',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      fun: {
        color: '#ff6b6b',
        backgroundColor: '#fff3cd',
        fontWeight: '700',
        fontSize: '20px',
        textAlign: 'center',
        borderRadius: '20px',
        padding: '15px',
        animation: 'bounce 2s infinite',
      }
    };
    setStyles(presets[preset]);
  };

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Text Design Studio
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          {!previewMode && (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Design
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        {!previewMode && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {(['basic', 'advanced', 'iframe'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 font-medium capitalize border-b-2 transition-colors',
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Basic Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                {/* Presets */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['neon', 'gaming', 'elegant', 'fun'] as const).map((preset) => (
                      <button
                        key={preset}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded capitalize hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={styles.fontFamily || ''}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  >
                    <option value="">Default</option>
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium mb-2">Font Size</label>
                  <select
                    value={styles.fontSize || ''}
                    onChange={(e) => updateStyle('fontSize', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  >
                    <option value="">Default</option>
                    {FONT_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Font Weight */}
                <div>
                  <label className="block text-sm font-medium mb-2">Font Weight</label>
                  <select
                    value={styles.fontWeight || ''}
                    onChange={(e) => updateStyle('fontWeight', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  >
                    <option value="">Default</option>
                    {FONT_WEIGHTS.map(weight => (
                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                  </select>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Color</label>
                    <div className="space-y-2">
                      <input
                        type="color"
                        value={styles.color || '#000000'}
                        onChange={(e) => updateStyle('color', e.target.value)}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                      <div className="grid grid-cols-6 gap-1">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => updateStyle('color', color)}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Background Color</label>
                    <div className="space-y-2">
                      <input
                        type="color"
                        value={styles.backgroundColor || '#ffffff'}
                        onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                      <div className="grid grid-cols-6 gap-1">
                        {PRESET_COLORS.map(color => (
                          <button
                            key={color}
                            onClick={() => updateStyle('backgroundColor', color)}
                            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-4">
                {/* Border */}
                <div>
                  <label className="block text-sm font-medium mb-2">Border</label>
                  <input
                    type="text"
                    value={styles.border || ''}
                    onChange={(e) => updateStyle('border', e.target.value)}
                    placeholder="e.g., 2px solid #000000"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Border Radius */}
                <div>
                  <label className="block text-sm font-medium mb-2">Border Radius</label>
                  <input
                    type="text"
                    value={styles.borderRadius || ''}
                    onChange={(e) => updateStyle('borderRadius', e.target.value)}
                    placeholder="e.g., 8px"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-sm font-medium mb-2">Padding</label>
                  <input
                    type="text"
                    value={styles.padding || ''}
                    onChange={(e) => updateStyle('padding', e.target.value)}
                    placeholder="e.g., 16px"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Text Shadow */}
                <div>
                  <label className="block text-sm font-medium mb-2">Text Shadow</label>
                  <input
                    type="text"
                    value={styles.textShadow || ''}
                    onChange={(e) => updateStyle('textShadow', e.target.value)}
                    placeholder="e.g., 2px 2px 4px rgba(0,0,0,0.5)"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Box Shadow */}
                <div>
                  <label className="block text-sm font-medium mb-2">Box Shadow</label>
                  <input
                    type="text"
                    value={styles.boxShadow || ''}
                    onChange={(e) => updateStyle('boxShadow', e.target.value)}
                    placeholder="e.g., 0 4px 6px rgba(0,0,0,0.1)"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                </div>

                {/* Animation */}
                <div>
                  <label className="block text-sm font-medium mb-2">Animation</label>
                  <select
                    value={styles.animation || ''}
                    onChange={(e) => updateStyle('animation', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  >
                    {ANIMATION_PRESETS.map(animation => (
                      <option key={animation} value={animation === 'none' ? '' : animation}>
                        {animation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom CSS */}
                <div>
                  <label className="block text-sm font-medium mb-2">Custom CSS</label>
                  <textarea
                    value={styles.customCSS || ''}
                    onChange={(e) => updateStyle('customCSS', e.target.value)}
                    placeholder="Enter custom CSS properties..."
                    rows={4}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {/* Iframe Tab */}
            {activeTab === 'iframe' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    External Design Iframe URL
                  </label>
                  <input
                    type="url"
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    placeholder="https://your-design-tool.com/embed"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use external design tools or custom HTML/CSS for advanced styling
                  </p>
                </div>

                {iframeUrl && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded">
                    <iframe
                      src={iframeUrl}
                      className="w-full h-64 rounded"
                      sandbox="allow-scripts allow-same-origin"
                      title="Design Tool"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Preview Panel */}
        <div className={cn('space-y-4', previewMode && 'lg:col-span-2')}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Preview
          </h3>
          
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <div
              style={{ ...styles }}
              className="transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* CSS Output */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated CSS
            </h4>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
              {generateCSS(styles)}
            </pre>
          </div>

          {/* Iframe Preview */}
          {iframeUrl && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                External Design Tool
              </h4>
              <div className="border border-gray-300 dark:border-gray-600 rounded">
                <iframe
                  src={iframeUrl}
                  className="w-full h-64 rounded"
                  sandbox="allow-scripts allow-same-origin"
                  title="External Design Tool"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes glow {
          from { text-shadow: 0 0 5px currentColor; }
          to { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }
        @keyframes rainbow {
          0% { color: #ff0000; }
          16% { color: #ff8000; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          66% { color: #0080ff; }
          83% { color: #8000ff; }
          100% { color: #ff0000; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}