
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { getMobileRoleBasedRoute } from '@/utils/mobileRouting';
import toast from 'react-hot-toast';

// Define UserRole type locally since it's not exported from supabase types
type UserRole = 'student' | 'educator' | 'admin';

export const MobileAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('MobileAuthCallback: Processing OAuth callback');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('MobileAuthCallback: Error getting session:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth?error=callback_failed');
          return;
        }

        if (data.session?.user) {
          console.log('MobileAuthCallback: User authenticated:', data.session.user.id);
          
          // Get pending role and clean up
          const pendingUserRole = localStorage.getItem('pendingUserRole');
          if (pendingUserRole) {
            localStorage.removeItem('pendingUserRole');
          }
          
          // Determine role
          const userRole = pendingUserRole || data.session.user.user_metadata?.role || 'student';
          console.log('MobileAuthCallback: User role determined as:', userRole);
          
          toast.success(`Welcome! Successfully signed in as ${userRole}.`);
          
          // Use mobile-specific routing
          const redirectRoute = getMobileRoleBasedRoute(userRole as UserRole, true);
          console.log('MobileAuthCallback: Redirecting to:', redirectRoute);
          
          navigate(redirectRoute, { replace: true });
        } else {
          console.log('MobileAuthCallback: No session found, redirecting to auth');
          toast.error('Authentication incomplete. Please try signing in again.');
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('MobileAuthCallback: Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center animate-pulse">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          <LocalizedText text="Completing Sign In..." />
        </h2>
        <p className="text-muted-foreground">
          <LocalizedText text="Please wait while we set up your account" />
        </p>
      </div>
    </div>
  );
};
