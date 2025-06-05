
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
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          // If profile doesn't exist, default to student role
          if (error.code === 'PGRST116') {
            console.log('Profile not found, defaulting to student role');
            setRole('student');
          } else {
            setRole(null);
          }
        } else {
          setRole(data?.role || 'student');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        // Default to student role on error
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};
