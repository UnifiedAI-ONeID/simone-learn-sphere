
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { MobileHeader } from './MobileHeader';

export const MobileLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader />
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
};
