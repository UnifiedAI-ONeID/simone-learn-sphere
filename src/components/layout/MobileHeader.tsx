import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LocalizedText } from '@/components/LocalizedText';
import { LanguageSelector } from '@/components/LanguageSelector';

export const MobileHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <LocalizedText text="SimoneLabs" />
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
