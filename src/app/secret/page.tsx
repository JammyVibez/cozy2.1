'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function SecretPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const correctCode = 'MUNIA2024';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleUnlock = async () => {
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (secretCode.toUpperCase() === correctCode) {
      setIsUnlocked(true);
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setSecretCode('');
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setSecretCode('');
    setAttempts(0);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              🔐 Secret Chamber
            </motion.h1>
            <p className="text-gray-300">
              Welcome, {session?.user?.name || 'Mysterious User'}
            </p>
          </div>

          {!isUnlocked ? (
            /* Lock Screen */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.3)",
                      "0 0 40px rgba(147, 51, 234, 0.6)",
                      "0 0 20px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Enter the Secret Code
                </h2>
                <p className="text-gray-400">
                  Only those who know the way may pass...
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                  placeholder="Enter secret code..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                {attempts > 0 && (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-red-400 text-sm"
                  >
                    Incorrect code. Attempts: {attempts}/3
                  </motion.p>
                )}

                <Button
                  onClick={handleUnlock}
                  disabled={isLoading || !secretCode.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Unlocking...
                    </div>
                  ) : (
                    'Unlock Secret'
                  )}
                </Button>
              </div>

              {attempts >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg"
                >
                  <p className="text-red-400 text-center">
                    Too many failed attempts. The secret remains hidden...
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Unlocked Content */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎉 Welcome to the Secret!
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-black/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-yellow-400 mb-4">
                    🏆 Congratulations!
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You've successfully unlocked the secret chamber! You are now among the elite few who have discovered this hidden treasure.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-900/30 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-300 mb-2">Secret Achievement</h4>
                      <p className="text-sm text-gray-300">Master Code Breaker</p>
                    </div>
                    <div className="bg-pink-900/30 rounded-lg p-4">
                      <h4 className="font-semibold text-pink-300 mb-2">Special Access</h4>
                      <p className="text-sm text-gray-300">VIP Member Status</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                    🌟 Secret Information
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• This page was created with love and attention to detail</li>
                    <li>• The secret code changes periodically (currently: MUNIA2024)</li>
                    <li>• You're one of the first to discover this hidden feature</li>
                    <li>• Share this secret with friends, but don't reveal the code!</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="flex-1 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white"
                  >
                    Lock Again
                  </Button>
                  <Button
                    onClick={() => router.push('/did-you-know')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Discover More
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-sm">
              Secret Chamber • Munia Platform • {new Date().getFullYear()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
