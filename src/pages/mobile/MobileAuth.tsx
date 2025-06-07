
import React from 'react';
import { Brain } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { SimpleMobileAuth } from '@/components/SimpleMobileAuth';

export const MobileAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-4 shadow-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <TranslatedText text="Welcome Back" />
          </h1>
          <p className="text-gray-600 mt-2">
            <TranslatedText text="Sign in to continue learning" />
          </p>
        </div>

        <SimpleMobileAuth />
      </div>
    </div>
  );
};
