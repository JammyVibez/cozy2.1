'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import Button from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Close, ActionsPlus } from '@/svg_components';

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  onPollCreate: (poll: {
    question: string;
    options: PollOption[];
    duration: number;
    allowMultiple: boolean;
  }) => void;
  onCancel: () => void;
  className?: string;
}

export function PollCreator({ onPollCreate, onCancel, className }: PollCreatorProps) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [duration, setDuration] = useState(24); // hours
  const [allowMultiple, setAllowMultiple] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: Date.now().toString(), text: '' }]);
    }
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSubmit = () => {
    const validOptions = options.filter(option => option.text.trim());
    
    if (question.trim() && validOptions.length >= 2) {
      onPollCreate({
        question: question.trim(),
        options: validOptions,
        duration,
        allowMultiple,
      });
    }
  };

  const isValid = question.trim() && options.filter(opt => opt.text.trim()).length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-6 max-w-md w-full',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Create Poll</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Close className="w-5 h-5" />
        </button>
      </div>

      {/* Question */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Question</label>
        <TextInput
          value={question}
          onChange={(value) => setQuestion(value)}
          placeholder="Ask a question..."
          maxLength={280}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <div className="flex-1">
                <TextInput
                  value={option.text}
                  onChange={(value) => updateOption(option.id, value)}
                  placeholder={`Option ${index + 1}`}
                  maxLength={100}
                />
              </div>
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(option.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Close className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              onClick={addOption}
              className="flex items-center gap-2 text-primary hover:text-primary-accent transition-colors"
            >
              <ActionsPlus className="w-4 h-4" />
              Add option
            </button>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Duration (hours)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number((e.target as HTMLSelectElement).value))}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>1 day</option>
            <option value={72}>3 days</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowMultiple}
            onChange={(e) => setAllowMultiple((e.target as HTMLInputElement).checked)}
            className="rounded"
          />
          <span className="text-sm">Allow multiple choices</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          mode="secondary"
          onPress={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onPress={handleSubmit}
          isDisabled={!isValid}
          className="flex-1"
        >
          Create Poll
        </Button>
      </div>
    </motion.div>
  );
}