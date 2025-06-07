
import React from 'react';
import { Brain } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { SimpleMobileAuth } from '@/components/SimpleMobileAuth';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';

export const MobileAuth = () => {
  const { platform } = usePlatformTheme();

  return (
    <PlatformLayout className="flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={`flex h-16 w-16 items-center justify-center mx-auto mb-4 shadow-xl bg-[var(--platform-primary)] ${
            platform === 'ios' ? 'rounded-2xl' : 
            platform === 'android' ? 'rounded-full' : 'rounded-xl'
          }`}>
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl bg-gradient-to-r from-[var(--platform-primary)] to-[var(--platform-secondary)] bg-clip-text text-transparent ${
            platform === 'ios' ? 'font-semibold' : 
            platform === 'android' ? 'font-medium' : 'font-bold'
          }`}>
            <TranslatedText text="Welcome Back" />
          </h1>
          <p className="text-[var(--platform-text-secondary)] mt-2">
            <TranslatedText text="Sign in to continue learning" />
          </p>
        </div>

        <SimpleMobileAuth />
      </div>
    </PlatformLayout>
  );
};
