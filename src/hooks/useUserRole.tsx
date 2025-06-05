
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
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Try to get role from user metadata first
        const metadataRole = user.user_metadata?.role;
        if (metadataRole) {
          setRole(metadataRole);
          setLoading(false);
          
          // Still fetch from database to ensure consistency
          fetchFromDatabase();
          return;
        }

        // Fetch from database
        await fetchFromDatabase();
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Default to student role on error
        setRole('student');
        setLoading(false);
      }
    };

    const fetchFromDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user!.id)
          .single();

        if (error) {
          console.error('Error fetching user role from database:', error);
          
          // If profile doesn't exist, create it with default role
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating default profile');
            
            const defaultRole = user!.user_metadata?.role || 'student';
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user!.id,
                email: user!.email,
                first_name: user!.user_metadata?.first_name || '',
                last_name: user!.user_metadata?.last_name || '',
                role: defaultRole
              });
            
            if (!insertError) {
              setRole(defaultRole);
            } else {
              console.error('Error creating profile:', insertError);
              setRole('student');
            }
          } else {
            setRole('student');
          }
        } else {
          setRole(data?.role || 'student');
        }
      } catch (error) {
        console.error('Database error:', error);
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};
