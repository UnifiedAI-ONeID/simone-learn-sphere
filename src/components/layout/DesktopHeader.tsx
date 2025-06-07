
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TranslatedText } from '@/components/TranslatedText';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';

export const DesktopHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            <TranslatedText text="Welcome back!" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <TranslatedText text="Here's what's happening with your learning today." />
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>
          <LanguageSelector />
          <AccessibilityControls />
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
