'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from '@/components/ui/Calendar';
import { TextInput } from '@/components/ui/TextInput';
import { Textarea } from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { Calendar as CalendarIcon, ActionsPlus, Close } from '@/svg_components';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledFor: Date;
  status: 'scheduled' | 'published' | 'failed';
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

interface PostSchedulerProps {
  onSchedule: (post: {
    content: string;
    scheduledFor: Date;
    media?: File[];
  }) => void;
  onCancel: () => void;
  className?: string;
}

export function PostScheduler({ onSchedule, onCancel, className }: PostSchedulerProps) {
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [media, setMedia] = useState<File[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia(prev => [...prev, ...files].slice(0, 4)); // Max 4 files
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSchedule = () => {
    if (!content.trim()) return;

    // Combine date and time
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(hours, minutes);

    onSchedule({
      content: content.trim(),
      scheduledFor: scheduledDate,
      media: media.length > 0 ? media : undefined,
    });
  };

  const isValid = content.trim() && selectedDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6 max-w-2xl w-full',
        className
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Schedule Post</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Close className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Textarea
            value={content}
            onChange={(value) => setContent(value)}
            placeholder="What's on your mind?"
            maxLength={500}
            className="w-full"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">
              {content.length}/500 characters
            </span>
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Media (optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
              disabled={media.length >= 4}
            />
            <label
              htmlFor="media-upload"
              className={cn(
                'cursor-pointer flex flex-col items-center gap-2',
                media.length >= 4 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <ActionsPlus className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                {media.length >= 4 ? 'Maximum 4 files' : 'Click to upload media'}
              </span>
            </label>
          </div>

          {/* Media Preview */}
          {media.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {media.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Close className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center gap-2 px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-left"
              >
                <CalendarIcon className="w-4 h-4" />
                {selectedDate.toLocaleDateString()}
              </button>
              
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4"
                  >
                    {/* Calendar placeholder - will be replaced with proper date picker */}
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Calendar component needs proper React Aria implementation
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <TextInput
              type="time"
              value={selectedTime}
              onChange={(value) => setSelectedTime(value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Preview scheduled time */}
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm">
            <span className="font-medium">Scheduled for:</span>{' '}
            {new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(selectedTime.split(':')[0]),
              parseInt(selectedTime.split(':')[1])
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button
          mode="secondary"
          onPress={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onPress={handleSchedule}
          isDisabled={!isValid}
          className="flex-1"
        >
          Schedule Post
        </Button>
      </div>
    </motion.div>
  );
}

// Component for managing scheduled posts
export function ScheduledPostsList() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduledPosts = async () => {
    try {
      const response = await fetch('/api/posts/scheduled');
      const data = await response.json();
      setScheduledPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelScheduledPost = async (postId: string) => {
    try {
      await fetch(`/api/posts/scheduled/${postId}`, {
        method: 'DELETE',
      });
      setScheduledPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error canceling scheduled post:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading scheduled posts...</div>;
  }

  if (scheduledPosts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No scheduled posts yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scheduledPosts.map((post) => (
        <div key={post.id} className="bg-card rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <p className="text-sm line-clamp-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Scheduled: {new Date(post.scheduledFor).toLocaleString()}
                </span>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  post.status === 'scheduled' && 'bg-blue-100 text-blue-700',
                  post.status === 'published' && 'bg-green-100 text-green-700',
                  post.status === 'failed' && 'bg-red-100 text-red-700'
                )}>
                  {post.status}
                </span>
              </div>
            </div>
            {post.status === 'scheduled' && (
              <Button
                mode="ghost"
                size="small"
                onPress={() => cancelScheduledPost(post.id)}
                className="text-red-600 hover:text-red-700"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}