
'use client';

import React, { useState } from 'react';
import { ReportModal } from './ReportModal';

interface ReportButtonProps {
  targetType: 'POST' | 'COMMENT' | 'USER';
  targetId: string;
  targetTitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ReportButton({ 
  targetType, 
  targetId, 
  targetTitle, 
  className = "", 
  children 
}: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children || '🚩 Report'}
      </button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetType={targetType}
        targetId={targetId}
        targetTitle={targetTitle}
      />
    </>
  );
}
