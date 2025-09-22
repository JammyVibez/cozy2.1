'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface Fact {
  id: number;
  category: string;
  fact: string;
  emoji: string;
  source?: string;
}

const facts: Fact[] = [
  {
    id: 1,
    category: 'Technology',
    fact: 'The first computer bug was an actual bug! In 1947, Grace Hopper found a moth stuck in a Harvard Mark II computer, coining the term "debugging."',
    emoji: '🐛',
    source: 'Computer History Museum'
  },
  {
    id: 2,
    category: 'Space',
    fact: 'A day on Venus is longer than its year! Venus takes 243 Earth days to rotate once but only 225 Earth days to orbit the Sun.',
    emoji: '🪐',
    source: 'NASA'
  },
  {
    id: 3,
    category: 'Nature',
    fact: 'Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.',
    emoji: '🐙',
    source: 'National Geographic'
  },
  {
    id: 4,
    category: 'History',
    fact: 'The shortest war in history lasted only 38-45 minutes! The Anglo-Zanzibar War of 1896 ended when the Sultan\'s palace was destroyed.',
    emoji: '⚔️',
    source: 'Guinness World Records'
  },
  {
    id: 5,
    category: 'Science',
    fact: 'Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs that are over 3000 years old.',
    emoji: '🍯',
    source: 'Smithsonian Magazine'
  },
  {
    id: 6,
    category: 'Psychology',
    fact: 'Your brain uses 20% of your body\'s energy despite being only 2% of your body weight. It\'s the most energy-consuming organ!',
    emoji: '🧠',
    source: 'Scientific American'
  },
  {
    id: 7,
    category: 'Animals',
    fact: 'A group of flamingos is called a "flamboyance" - which perfectly describes their vibrant pink appearance!',
    emoji: '🦩',
    source: 'Oxford Dictionary'
  },
  {
    id: 8,
    category: 'Geography',
    fact: 'There are more possible games of chess than atoms in the observable universe! The number is approximately 10^120.',
    emoji: '♟️',
    source: 'Chess.com'
  },
  {
    id: 9,
    category: 'Language',
    fact: 'The word "set" has the most definitions in the English language - over 400 different meanings!',
    emoji: '📚',
    source: 'Oxford English Dictionary'
  },
  {
    id: 10,
    category: 'Physics',
    fact: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth, but it takes 100,000 years to travel from the Sun\'s core to its surface!',
    emoji: '☀️',
    source: 'NASA Solar System'
  },
  {
    id: 11,
    category: 'Biology',
    fact: 'Bananas are berries, but strawberries aren\'t! Botanically speaking, berries have seeds inside their flesh.',
    emoji: '🍌',
    source: 'Botanical Society'
  },
  {
    id: 12,
    category: 'Mathematics',
    fact: 'The number 142857 is magical! When multiplied by 1, 2, 3, 4, 5, or 6, the result is always a cyclic permutation of the same digits.',
    emoji: '🔢',
    source: 'Mathematical Association'
  },
  {
    id: 13,
    category: 'Culture',
    fact: 'In Japan, there\'s a word "tsundoku" which means buying books and letting them pile up unread - a habit many of us know well!',
    emoji: '📖',
    source: 'Japanese Language Institute'
  },
  {
    id: 14,
    category: 'Medicine',
    fact: 'Your stomach gets a new lining every 3-5 days! This prevents it from digesting itself with its own acid.',
    emoji: '🫀',
    source: 'Medical Research Journal'
  },
  {
    id: 15,
    category: 'Art',
    fact: 'The Mona Lisa has no eyebrows! This was fashionable in Renaissance Florence, where women shaved their eyebrows.',
    emoji: '🎨',
    source: 'Louvre Museum'
  }
];

const categories = ['All', 'Technology', 'Space', 'Nature', 'History', 'Science', 'Psychology', 'Animals', 'Geography', 'Language', 'Physics', 'Biology', 'Mathematics', 'Culture', 'Medicine', 'Art'];

export default function DidYouKnowPage() {
  const [currentFact, setCurrentFact] = useState<Fact>(facts[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [factCount, setFactCount] = useState(0);

  const filteredFacts = selectedCategory === 'All' 
    ? facts 
    : facts.filter(fact => fact.category === selectedCategory);

  const nextFact = () => {
    const currentIndex = filteredFacts.findIndex(fact => fact.id === currentFact.id);
    const nextIndex = (currentIndex + 1) % filteredFacts.length;
    setCurrentFact(filteredFacts[nextIndex]);
    setFactCount(prev => prev + 1);
  };

  const prevFact = () => {
    const currentIndex = filteredFacts.findIndex(fact => fact.id === currentFact.id);
    const prevIndex = currentIndex === 0 ? filteredFacts.length - 1 : currentIndex - 1;
    setCurrentFact(filteredFacts[prevIndex]);
    setFactCount(prev => prev + 1);
  };

  const randomFact = () => {
    const randomIndex = Math.floor(Math.random() * filteredFacts.length);
    setCurrentFact(filteredFacts[randomIndex]);
    setFactCount(prev => prev + 1);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextFact, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, filteredFacts, currentFact]);

  useEffect(() => {
    // Reset to first fact when category changes
    if (filteredFacts.length > 0) {
      setCurrentFact(filteredFacts[0]);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            >
              🤔 Did You Know?
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Discover amazing facts that will blow your mind!
            </p>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Fact Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFact.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    {currentFact.emoji}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4"
                  >
                    {currentFact.category}
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-6"
                >
                  {currentFact.fact}
                </motion.p>

                {currentFact.source && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm text-gray-500 dark:text-gray-400 italic"
                  >
                    Source: {currentFact.source}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            >
              <Button
                onClick={prevFact}
                variant="outline"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <Button
                onClick={randomFact}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                🎲 Random Fact
              </Button>

              <Button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                variant={isAutoPlaying ? "default" : "outline"}
                className={isAutoPlaying ? "bg-green-600 hover:bg-green-700 text-white" : ""}
              >
                {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto Play'}
              </Button>

              <Button
                onClick={nextFact}
                variant="outline"
                className="flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Fact {filteredFacts.findIndex(fact => fact.id === currentFact.id) + 1} of {filteredFacts.length}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((filteredFacts.findIndex(fact => fact.id === currentFact.id) + 1) / filteredFacts.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{facts.length}</div>
              <div className="text-gray-600 dark:text-gray-300">Total Facts</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-pink-600 mb-2">{categories.length - 1}</div>
              <div className="text-gray-600 dark:text-gray-300">Categories</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{factCount}</div>
              <div className="text-gray-600 dark:text-gray-300">Facts Viewed</div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Knowledge is power! Keep exploring and learning new things every day.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={() => window.location.href = '/secret'}
                variant="outline"
                size="sm"
              >
                🔐 Secret Page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
              >
                🏠 Go Home
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
