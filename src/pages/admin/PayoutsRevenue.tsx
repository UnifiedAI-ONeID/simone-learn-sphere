
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';

export const PayoutsRevenue = () => {
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">
          Payouts & Revenue
        </h1>
        <PlatformCard>
          <p className="text-muted-foreground">
            Platform revenue and payout management coming soon...
          </p>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
