
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        console.log('useUserRole: No user, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      console.log('useUserRole: Fetching role for user:', user.id);

      try {
        // Try user metadata first for speed
        const metadataRole = user.user_metadata?.role;
        if (metadataRole) {
          console.log('useUserRole: Found role in metadata:', metadataRole);
          setRole(metadataRole);
          setLoading(false);
          return;
        }

        // Fetch from database
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('useUserRole: Database error:', error);
          
          // If profile doesn't exist, use default and try to create it
          if (error.code === 'PGRST116') {
            const defaultRole = 'student';
            console.log('useUserRole: Profile not found, using default role:', defaultRole);
            setRole(defaultRole);
            
            // Try to create profile asynchronously
            setTimeout(async () => {
              try {
                await supabase.from('profiles').insert({
                  id: user.id,
                  email: user.email,
                  first_name: user.user_metadata?.first_name || '',
                  last_name: user.user_metadata?.last_name || '',
                  role: defaultRole
                });
                console.log('useUserRole: Created profile with default role');
              } catch (insertError) {
                console.error('useUserRole: Failed to create profile:', insertError);
              }
            }, 100);
          } else {
            setRole('student'); // Fallback
          }
        } else {
          console.log('useUserRole: Found role in database:', data?.role);
          setRole(data?.role || 'student');
        }
      } catch (error) {
        console.error('useUserRole: Unexpected error:', error);
        setRole('student'); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};
