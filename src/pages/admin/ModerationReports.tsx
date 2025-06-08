
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { LocalizedText } from '@/components/LocalizedText';

export const ModerationReports = () => {
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">
          <LocalizedText text="Moderation & Reports" />
        </h1>
        <PlatformCard>
          <p className="text-muted-foreground">
            <LocalizedText text="Content moderation and abuse reports management coming soon..." />
          </p>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
