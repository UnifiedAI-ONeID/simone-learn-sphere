
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TranslatedText } from '@/components/TranslatedText';
import { Badge } from '@/components/ui/badge';

export const MobileAppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-purple-100 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <TranslatedText text="SimoneLabs" />
            </h1>
            <p className="text-xs text-gray-500">
              <TranslatedText text="Mobile Learning" />
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500"></Badge>
          </Button>
          <Avatar className="h-9 w-9 ring-2 ring-purple-100">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
