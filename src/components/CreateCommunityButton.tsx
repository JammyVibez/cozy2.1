'use client';

import { useState } from 'react';
import Button from './ui/Button';
import { ActionsPlus } from '@/svg_components';
import { CreateCommunityModal } from './CreateCommunityModal';

export function CreateCommunityButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onPress={() => setShowModal(true)}
        className="flex items-center gap-2"
        mode="primary"
        Icon={ActionsPlus}
      >
        Create Community
      </Button>
      
      {showModal && (
        <CreateCommunityModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}