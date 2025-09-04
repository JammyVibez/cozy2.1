'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useToast } from '@/hooks/useToast';
import Button from './ui/Button';

interface TipButtonProps {
  receiverId: string;
  postId?: number;
  className?: string;
}

const tipAmounts = [5, 10, 25, 50, 100];

export function TipButton({ receiverId, postId, className }: TipButtonProps) {
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [message, setMessage] = useState('');
  
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const tipMutation = useMutation({
    mutationFn: async (data: { receiverId: string; amount: number; message?: string; postId?: number }) => {
      const response = await fetch('/api/monetization/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send tip');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setShowTipModal(false);
      setMessage('');
      showToast({ 
        title: 'Tip Sent! 🪙', 
        message: `Sent ${selectedAmount} Cozy Coins`,
        type: 'success' 
      });
      queryClient.invalidateQueries({ queryKey: ['user-coins'] });
    },
    onError: (error: Error) => {
      showToast({ 
        title: 'Error', 
        message: error.message, 
        type: 'error' 
      });
    },
  });

  const handleSendTip = () => {
    tipMutation.mutate({
      receiverId,
      amount: selectedAmount,
      message: message.trim() || undefined,
      postId,
    });
  };

  return (
    <>
      <Button
        onPress={() => setShowTipModal(true)}
        mode="ghost"
        size="small"
        className={cn('flex items-center gap-1 text-amber-600 hover:text-amber-700', className)}
      >
        <span>🪙</span>
        <span className="text-sm">Tip</span>
      </Button>

      <AnimatePresence>
        {showTipModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🪙</div>
                  <h3 className="text-xl font-bold">Send Cozy Coins</h3>
                  <p className="text-muted-foreground">Support this creator</p>
                </div>

                {/* Amount Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <div className="grid grid-cols-5 gap-2">
                    {tipAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setSelectedAmount(amount)}
                        className={cn(
                          'p-3 rounded-lg border text-center transition-colors',
                          selectedAmount === amount
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'hover:bg-muted border-input'
                        )}
                      >
                        <div className="text-sm font-medium">{amount}</div>
                        <div className="text-xs text-muted-foreground">coins</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    Balance: 100 coins
                  </div>
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say something nice..."
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <div className="mt-1 text-xs text-muted-foreground text-right">
                    {message.length}/200
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onPress={() => setShowTipModal(false)}
                    mode="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={handleSendTip}
                    loading={tipMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  >
                    Send {selectedAmount} 🪙
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}