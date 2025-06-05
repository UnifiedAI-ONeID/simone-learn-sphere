
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
}

export const DashboardHeader = ({ title, subtitle, badgeText, badgeIcon: BadgeIcon }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            <DisplayBadgeIcon className="w-4 h-4 mr-1" />
            {displayBadgeText}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>{isSigningOut ? 'Signing Out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
