import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, LogOut, Settings } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { UserAvatar } from '../UserAvatar';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
}

export const DesktopHeader = ({ title, subtitle, badgeText, badgeIcon: BadgeIcon }: DashboardHeaderProps) => {
  const { signOut, user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userProfile, setUserProfile] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out error",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  // Use provided badge info or fall back to role-based defaults
  const displayBadgeText = badgeText || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User');
  const DisplayBadgeIcon = BadgeIcon || Brain;

  return (
    <header className="border-b bg-white dark:bg-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <UnifiedLocalizedText text={title} />
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              <UnifiedLocalizedText text={subtitle} />
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" className="px-3 py-1">
            <DisplayBadgeIcon className="w-4 h-4 mr-1" />
            <UnifiedLocalizedText text={displayBadgeText} />
          </Button>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile?.first_name} {userProfile?.last_name}
              </p>
              <p className="text-xs text-gray-500">
                {role?.charAt(0).toUpperCase()}{role?.slice(1)}
              </p>
            </div>
            
            <button
              onClick={handleProfileClick}
              className="relative group"
              title="Profile Settings"
            >
              <UserAvatar
                userId={user?.id}
                firstName={userProfile?.first_name}
                lastName={userProfile?.last_name}
                size="md"
                className="ring-2 ring-transparent group-hover:ring-blue-300 transition-all cursor-pointer"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                <Settings className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text={isSigningOut ? 'Signing Out...' : 'Sign Out'} />
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};
