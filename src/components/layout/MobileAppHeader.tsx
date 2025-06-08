
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LocalizedText } from '@/components/LocalizedText';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

export const MobileAppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              <LocalizedText text="SimoneLabs" />
            </h1>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Mobile Learning" />
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive"></Badge>
          </Button>
          <Avatar className="h-9 w-9 ring-2 ring-border">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
