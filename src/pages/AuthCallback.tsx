
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getRoleBasedRoute } from '@/utils/roleRouting';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Processing OAuth callback');
        
        // Get the session from the URL hash/params
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthCallback: Error getting session:', error);
          navigate('/auth?error=callback_failed');
          return;
        }

        if (data.session?.user) {
          console.log('AuthCallback: User authenticated:', data.session.user.id);
          
          // Get user role and redirect to appropriate dashboard
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          const userRole = profile?.role || data.session.user.user_metadata?.role || 'student';
          console.log('AuthCallback: User role:', userRole);
          
          const redirectRoute = getRoleBasedRoute(userRole);
          console.log('AuthCallback: Redirecting to:', redirectRoute);
          
          navigate(redirectRoute, { replace: true });
        } else {
          console.log('AuthCallback: No session found, redirecting to auth');
          navigate('/auth', { replace: true });
        }
      } catch (error) {
        console.error('AuthCallback: Unexpected error:', error);
        navigate('/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
