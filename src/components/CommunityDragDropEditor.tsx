
'use client';

import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Close } from '@/svg_components';

interface CommunityComponent {
  id: string;
  type: 'header' | 'feed' | 'events' | 'chat' | 'members' | 'announcements' | 'gallery' | 'resources';
  title: string;
  description: string;
  icon: string;
  config: Record<string, any>;
  enabled: boolean;
}

interface CommunityDragDropEditorProps {
  initialComponents: CommunityComponent[];
  onComponentsChange: (components: CommunityComponent[]) => void;
  onStyleChange: (styles: Record<string, any>) => void;
}

const availableComponents: Omit<CommunityComponent, 'id' | 'enabled'>[] = [
  {
    type: 'header',
    title: 'Community Header',
    description: 'Display community name, description, and basic info',
    icon: '🏠',
    config: { showMemberCount: true, showDescription: true }
  },
  {
    type: 'feed',
    title: 'Post Feed',
    description: 'Main content feed for community posts',
    icon: '📝',
    config: { allowImages: true, allowPolls: true, postLimit: 20 }
  },
  {
    type: 'events',
    title: 'Events Calendar',
    description: 'Upcoming community events and activities',
    icon: '📅',
    config: { showCalendar: true, allowRSVP: true }
  },
  {
    type: 'chat',
    title: 'Live Chat',
    description: 'Real-time community chat rooms',
    icon: '💬',
    config: { maxRooms: 5, allowPrivate: false }
  },
  {
    type: 'members',
    title: 'Member Directory',
    description: 'Browse and connect with community members',
    icon: '👥',
    config: { showProfiles: true, allowDM: true }
  },
  {
    type: 'announcements',
    title: 'Announcements',
    description: 'Important community announcements',
    icon: '📢',
    config: { pinned: true, adminOnly: true }
  },
  {
    type: 'gallery',
    title: 'Media Gallery',
    description: 'Shared photos and media from the community',
    icon: '🖼️',
    config: { allowUploads: true, maxFileSize: '10MB' }
  },
  {
    type: 'resources',
    title: 'Resource Library',
    description: 'Shared documents, links, and resources',
    icon: '📚',
    config: { allowUploads: true, categories: ['General', 'Guides', 'Tools'] }
  }
];

function SortableComponent({ component, onRemove, onConfigChange }: {
  component: CommunityComponent;
  onRemove: (id: string) => void;
  onConfigChange: (id: string, config: Record<string, any>) => void;
}) {
  const [showConfig, setShowConfig] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-card border rounded-lg p-4 space-y-3 transition-all duration-200',
        isDragging ? 'opacity-50 scale-105 shadow-lg' : 'hover:shadow-md'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <span className="text-lg">{component.icon}</span>
          </div>
          <div>
            <h4 className="font-medium">{component.title}</h4>
            <p className="text-sm text-muted-foreground">{component.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            ⚙️
          </button>
          <button
            onClick={() => onRemove(component.id)}
            className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
          >
            <Close className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showConfig && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t pt-3 space-y-3"
        >
          <h5 className="font-medium text-sm">Component Settings</h5>
          {Object.entries(component.config).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              {typeof value === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => 
                    onConfigChange(component.id, { ...component.config, [key]: e.target.checked })
                  }
                  className="rounded"
                />
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => 
                    onConfigChange(component.id, { ...component.config, [key]: parseInt(e.target.value) })
                  }
                  className="w-20 px-2 py-1 text-sm border rounded"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => 
                    onConfigChange(component.id, { ...component.config, [key]: e.target.value })
                  }
                  className="w-32 px-2 py-1 text-sm border rounded"
                />
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function CommunityDragDropEditor({ initialComponents, onComponentsChange, onStyleChange }: CommunityDragDropEditorProps) {
  const [components, setComponents] = useState<CommunityComponent[]>(initialComponents);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [styles, setStyles] = useState({
    theme: 'default',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    spacing: 'normal'
  });

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex(item => item.id === active.id);
      const newIndex = components.findIndex(item => item.id === over.id);
      
      const newComponents = arrayMove(components, oldIndex, newIndex);
      setComponents(newComponents);
      onComponentsChange(newComponents);
    }
    
    setActiveId(null);
  }, [components, onComponentsChange]);

  const addComponent = useCallback((componentType: string) => {
    const template = availableComponents.find(c => c.type === componentType);
    if (!template) return;

    const newComponent: CommunityComponent = {
      ...template,
      id: `${componentType}-${Date.now()}`,
      enabled: true
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    onComponentsChange(newComponents);
  }, [components, onComponentsChange]);

  const removeComponent = useCallback((id: string) => {
    const newComponents = components.filter(c => c.id !== id);
    setComponents(newComponents);
    onComponentsChange(newComponents);
  }, [components, onComponentsChange]);

  const updateComponentConfig = useCallback((id: string, config: Record<string, any>) => {
    const newComponents = components.map(c => 
      c.id === id ? { ...c, config } : c
    );
    setComponents(newComponents);
    onComponentsChange(newComponents);
  }, [components, onComponentsChange]);

  const updateStyles = useCallback((newStyles: Record<string, any>) => {
    setStyles({ ...styles, ...newStyles });
    onStyleChange({ ...styles, ...newStyles });
  }, [styles, onStyleChange]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Component Library */}
      <div className="space-y-4">
        <h3 className="font-semibold">Available Components</h3>
        <div className="space-y-2">
          {availableComponents.map((component) => (
            <button
              key={component.type}
              onClick={() => addComponent(component.type)}
              className="w-full p-3 text-left bg-muted hover:bg-muted-foreground/10 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{component.icon}</span>
                <div>
                  <div className="font-medium text-sm">{component.title}</div>
                  <div className="text-xs text-muted-foreground">{component.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-semibold">Community Layout</h3>
        <div className="bg-muted/30 rounded-lg p-4 min-h-[500px]">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {components.map((component) => (
                  <SortableComponent
                    key={component.id}
                    component={component}
                    onRemove={removeComponent}
                    onConfigChange={updateComponentConfig}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-card border rounded-lg p-4 shadow-lg">
                  {components.find(c => c.id === activeId)?.title}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {components.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">🎨</div>
              <p>Drag components from the left to build your community</p>
            </div>
          )}
        </div>
      </div>

      {/* Style Panel */}
      <div className="space-y-4">
        <h3 className="font-semibold">Styling</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={styles.theme}
              onChange={(e) => updateStyles({ theme: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="minimal">Minimal</option>
              <option value="colorful">Colorful</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <input
              type="color"
              value={styles.primaryColor}
              onChange={(e) => updateStyles({ primaryColor: e.target.value })}
              className="w-full h-10 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Border Radius</label>
            <select
              value={styles.borderRadius}
              onChange={(e) => updateStyles({ borderRadius: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="0px">None</option>
              <option value="4px">Small</option>
              <option value="8px">Medium</option>
              <option value="16px">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Spacing</label>
            <select
              value={styles.spacing}
              onChange={(e) => updateStyles({ spacing: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
