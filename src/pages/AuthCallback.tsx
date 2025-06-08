
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getRoleBasedRoute } from '@/utils/roleRouting';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing OAuth callback');
        
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
          
          // Get pending role and clean up
          const pendingUserRole = localStorage.getItem('pendingUserRole');
          if (pendingUserRole) {
            localStorage.removeItem('pendingUserRole');
          }
          
          // Determine role
          const userRole = pendingUserRole || data.session.user.user_metadata?.role || 'student';
          
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${userRole}.`,
          });
          
          // Redirect to appropriate dashboard
          const redirectRoute = getRoleBasedRoute(userRole, true);
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
