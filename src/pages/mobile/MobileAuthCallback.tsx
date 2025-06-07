
import React from 'react';
import { Brain } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileAuthCallback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          <LocalizedText text="Completing Sign In..." />
        </h2>
        <p className="text-gray-600">
          <LocalizedText text="Please wait while we set up your account" />
        </p>
      </div>
    </div>
  );
};
