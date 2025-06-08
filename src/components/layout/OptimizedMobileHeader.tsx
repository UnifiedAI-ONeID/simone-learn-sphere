import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, Menu, Settings, Bell } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMobileSidebar } from '@/contexts/MobileSidebarContext';

interface OptimizedMobileHeaderProps {
  onMenuOpen: () => void;
}

export const OptimizedMobileHeader: React.FC<OptimizedMobileHeaderProps> = ({ onMenuOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useMobileSidebar();

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="mr-2 h-6 w-6 text-primary" />
            <span className="font-bold text-xl">
              <UnifiedLocalizedText text="Platform" />
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileClick}
              aria-label="Profile settings"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
