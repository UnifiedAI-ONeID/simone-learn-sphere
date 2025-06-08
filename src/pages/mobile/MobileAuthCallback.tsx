
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import toast from 'react-hot-toast';

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
          
          toast.success(`Welcome! Successfully signed in as ${userRole}.`);
          
          // Redirect to appropriate dashboard
          const redirectRoute = getRoleBasedRoute(userRole, true);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          <LocalizedText text="Completing Sign In..." />
        </h2>
        <p className="text-gray-600">
          <LocalizedText text="Please wait while we set up your account" />
        </p>
      </div>
    </div>
  );
};
