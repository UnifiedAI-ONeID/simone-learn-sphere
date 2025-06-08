
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUnifiedRoleRoute } from '@/utils/unifiedRoleRouting';
import { ensureProfileExists } from '@/utils/consolidatedAuthUtils';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing OAuth callback');
        
        // Validate OAuth state for CSRF protection
        const urlParams = new URLSearchParams(window.location.search);
        const returnedState = urlParams.get('state');
        const storedState = localStorage.getItem('oauth_state');
        
        if (returnedState && storedState && returnedState !== storedState) {
          console.error('OAuth state mismatch - possible CSRF attack');
          toast({
            title: "Security Error",
            description: "Possible security issue detected. Please try signing in again.",
            variant: "destructive",
          });
          navigate('/auth?error=csrf_detected');
          return;
        }
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthCallback: Error getting session:', error);
          toast({
            title: "Authentication failed",
            description: "There was an error processing your login. Please try again.",
            variant: "destructive",
          });
          navigate('/auth?error=callback_failed');
          return;
        }

        if (data.session?.user) {
          console.log('AuthCallback: User authenticated:', data.session.user.id);
          
          // Get pending role and clean up state
          const pendingUserRole = localStorage.getItem('pendingUserRole');
          console.log('AuthCallback: Found pending role:', pendingUserRole);
          
          // Clean up OAuth state
          localStorage.removeItem('oauth_state');
          localStorage.removeItem('oauth_provider');
          
          if (pendingUserRole) {
            localStorage.removeItem('pendingUserRole');
          }
          
          // Determine role with priority for the selected role
          let userRole = pendingUserRole || data.session.user.user_metadata?.role || 'student';
          console.log('AuthCallback: Initial role determination:', userRole);
          
          // Ensure profile exists with the correct role
          try {
            const profile = await ensureProfileExists(data.session.user.id, data.session.user, userRole);
            if (profile && profile.role) {
              userRole = profile.role;
              console.log('AuthCallback: Role confirmed from profile:', userRole);
            }
          } catch (profileError) {
            console.error('AuthCallback: Profile creation failed:', profileError);
            // Continue with authentication even if profile creation fails
          }
          
          // Verify role in database with retry mechanism
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              console.log(`AuthCallback: Profile verification attempt ${attempt}`);
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.session.user.id)
                .single();
              
              if (profileData && !profileError) {
                userRole = profileData.role;
                console.log('AuthCallback: Role verified from database:', userRole);
                break;
              } else if (attempt === 3) {
                console.error('AuthCallback: Profile verification failed after 3 attempts:', profileError);
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
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${roleDisplayName}.`,
          });
          
          // Redirect to appropriate dashboard using unified routing
          const redirectRoute = getUnifiedRoleRoute(userRole, true, false);
          console.log('AuthCallback: Redirecting to:', redirectRoute);
          
          navigate(redirectRoute, { replace: true });
        } else {
          console.log('AuthCallback: No session found, redirecting to auth');
          toast({
            title: "Authentication incomplete",
            description: "Please try signing in again.",
            variant: "destructive",
          });
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('AuthCallback: Unexpected error:', error);
        toast({
          title: "Authentication error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
