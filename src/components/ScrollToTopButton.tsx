'use client';

import { useState, useEffect } from 'react';
import { ButtonNaked } from './ui/ButtonNaked';

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <ButtonNaked
        onPress={scrollToTop}
        className="w-12 h-12 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background text-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </ButtonNaked>
    </div>
  );
}
