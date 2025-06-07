
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
        
        // Get the session from the URL hash/params
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
          
          // Check for pending role selection from OAuth flow
          const pendingUserRole = localStorage.getItem('pendingUserRole');
          console.log('AuthCallback: Pending user role:', pendingUserRole);
          
          // Try to get existing profile first
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          let userRole = profile?.role;
          
          // If no profile exists or role needs to be updated from pending selection
          if (!profile || (pendingUserRole && profile.role !== pendingUserRole)) {
            console.log('AuthCallback: Creating/updating profile with role:', pendingUserRole || 'student');
            
            const roleToAssign = pendingUserRole || data.session.user.user_metadata?.role || 'student';
            
            const profileData = {
              id: data.session.user.id,
              email: data.session.user.email,
              first_name: data.session.user.user_metadata?.first_name || 
                          data.session.user.user_metadata?.full_name?.split(' ')[0] || '',
              last_name: data.session.user.user_metadata?.last_name || 
                         data.session.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
              role: roleToAssign
            };
            
            // Use upsert to handle both creation and updates
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert(profileData, { 
                onConflict: 'id',
                ignoreDuplicates: false 
              });
            
            if (upsertError) {
              console.error('AuthCallback: Error creating/updating profile:', upsertError);
              toast({
                title: "Profile setup failed",
                description: "There was an error setting up your profile. You may need to update your role in settings.",
                variant: "destructive",
              });
              // Continue with default role rather than blocking
              userRole = 'student';
            } else {
              userRole = roleToAssign;
              console.log('AuthCallback: Profile created/updated successfully with role:', userRole);
            }
          }
          
          // Clean up the pending role from localStorage
          if (pendingUserRole) {
            localStorage.removeItem('pendingUserRole');
            console.log('AuthCallback: Cleared pending user role from localStorage');
          }
          
          // Show success message
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${userRole}.`,
          });
          
          // Redirect to appropriate dashboard - prioritize admin role
          const redirectRoute = getRoleBasedRoute(userRole, true); // Pass true for login context
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600">Completing sign in...</p>
        <p className="text-sm text-gray-500">Setting up your profile...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
