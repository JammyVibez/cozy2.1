
import React from 'react';
import { CommunityCreationWizard } from '@/components/CommunityCreationWizard';

export const metadata = {
  title: 'Create Community - Munia',
  description: 'Create a new community with templates, custom layouts, and bot integrations',
};

export default function CreateCommunityPage() {
  return (
    <div className="container mx-auto py-8">
      <CommunityCreationWizard />
    </div>
  );
}
