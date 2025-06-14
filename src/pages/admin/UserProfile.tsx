
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';

export const UserProfile = () => {
  const { userId } = useParams();
  
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">
          User Profile
        </h1>
        <PlatformCard>
          <p className="text-muted-foreground">
            User profile management for user {userId} coming soon...
          </p>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
