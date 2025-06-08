
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';

export const ModerationReports = () => {
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">
          Moderation & Reports
        </h1>
        <PlatformCard>
          <p className="text-muted-foreground">
            Content moderation and abuse reports management coming soon...
          </p>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
