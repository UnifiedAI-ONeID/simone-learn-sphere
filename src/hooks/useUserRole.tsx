
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
        // First try user metadata
        const metadataRole = user.user_metadata?.role;
        if (metadataRole) {
          setRole(metadataRole);
          setLoading(false);
          return;
        }

        // Then try database
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('useUserRole: Database error:', error);
          // Default to student
          setRole('student');
        } else {
          setRole(data?.role || 'student');
        }
      } catch (error) {
        console.error('useUserRole: Unexpected error:', error);
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (targetRole: string): boolean => {
    if (!role) return false;
    if (role === 'admin') return true;
    return role.split('+').includes(targetRole);
  };

  const getAllRoles = (): string[] => {
    if (!role) return [];
    if (role === 'admin') return ['admin', 'educator', 'student'];
    return role.split('+');
  };

  return { role, loading, hasRole, getAllRoles };
};
