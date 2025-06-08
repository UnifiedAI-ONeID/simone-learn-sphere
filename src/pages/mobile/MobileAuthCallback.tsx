
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { supabase } from '@/integrations/supabase/client';
import { getUnifiedRoleRoute } from '@/utils/unifiedRoleRouting';
import { ensureProfileExists } from '@/utils/consolidatedAuthUtils';
import toast from 'react-hot-toast';

// Define UserRole type locally since it's not exported from supabase types
type UserRole = 'student' | 'educator' | 'admin';

export const MobileAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('MobileAuthCallback: Processing OAuth callback');
        
        // Validate OAuth state for CSRF protection
        const urlParams = new URLSearchParams(window.location.search);
        const returnedState = urlParams.get('state');
        const storedState = localStorage.getItem('oauth_state');
        
        if (returnedState && storedState && returnedState !== storedState) {
          console.error('OAuth state mismatch - possible CSRF attack');
          toast.error('Security error. Please try signing in again.');
          navigate('/mobile/auth?error=csrf_detected');
          return;
        }
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('MobileAuthCallback: Error getting session:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/mobile/auth?error=callback_failed');
          return;
        }

        if (data.session?.user) {
          console.log('MobileAuthCallback: User authenticated:', data.session.user.id);
          
          // Get pending role and clean up state
          const pendingUserRole = localStorage.getItem('pendingUserRole');
          console.log('MobileAuthCallback: Found pending role:', pendingUserRole);
          
          // Clean up OAuth state
          localStorage.removeItem('oauth_state');
          localStorage.removeItem('oauth_provider');
          
          if (pendingUserRole) {
            localStorage.removeItem('pendingUserRole');
          }
          
          // Determine role with priority for the selected role
          let userRole = pendingUserRole || data.session.user.user_metadata?.role || 'student';
          console.log('MobileAuthCallback: Initial role determination:', userRole);
          
          // Ensure profile exists with the correct role
          try {
            const profile = await ensureProfileExists(data.session.user.id, data.session.user, userRole);
            if (profile && profile.role) {
              userRole = profile.role;
              console.log('MobileAuthCallback: Role confirmed from profile:', userRole);
            }
          } catch (profileError) {
            console.error('MobileAuthCallback: Profile creation failed:', profileError);
            // Continue with authentication even if profile creation fails
          }
          
          // Verify role in database with retry mechanism
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              console.log(`MobileAuthCallback: Profile verification attempt ${attempt}`);
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.session.user.id)
                .single();
              
              if (profileData && !profileError) {
                userRole = profileData.role;
                console.log('MobileAuthCallback: Role verified from database:', userRole);
                break;
              } else if (attempt === 3) {
                console.error('MobileAuthCallback: Profile verification failed after 3 attempts:', profileError);
              }
            } catch (retryError) {
              console.warn(`Profile verification attempt ${attempt} failed:`, retryError);
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
              }
            }
          }
          
          // Show success message with role
          const roleDisplayName = userRole === 'educator' ? 'Educator' : 
                                 userRole === 'admin' ? 'Admin' : 'Student';
          toast.success(`Welcome! Successfully signed in as ${roleDisplayName}.`);
          
          // Use unified mobile routing
          const redirectRoute = getUnifiedRoleRoute(userRole as UserRole, true, true);
          console.log('MobileAuthCallback: Redirecting to:', redirectRoute);
          
          navigate(redirectRoute, { replace: true });
        } else {
          console.log('MobileAuthCallback: No session found, redirecting to auth');
          toast.error('Authentication incomplete. Please try signing in again.');
          navigate('/mobile/auth', { replace: true });
        }
      } catch (error) {
        console.error('MobileAuthCallback: Unexpected error:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/mobile/auth?error=callback_failed');
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
          <UnifiedLocalizedText text="Completing Sign In..." />
        </h2>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Setting up your account with the selected role" />
        </p>
      </div>
    </div>
  );
};
