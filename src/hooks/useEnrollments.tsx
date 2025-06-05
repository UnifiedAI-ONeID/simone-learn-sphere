
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  last_accessed_at: string;
  payment_status: string;
  course?: {
    title: string;
    description: string;
    thumbnail_url: string;
    estimated_duration: number;
    difficulty_level: string;
  };
}

export const useEnrollments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(title, description, thumbnail_url, estimated_duration, difficulty_level)
        `)
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to fetch enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          payment_status: 'completed', // For now, assuming free courses
        });

      if (error) throw error;

      // Update user streak and check for badges
      await supabase.rpc('update_user_streak', { user_id: user.id });
      await supabase.rpc('check_and_award_badges', { user_id: user.id });

      toast({
        title: "Success",
        description: "Successfully enrolled in course!",
      });

      fetchEnrollments();
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: progress,
          last_accessed_at: new Date().toISOString(),
          ...(progress === 100 && { completed_at: new Date().toISOString() }),
        })
        .eq('id', enrollmentId);

      if (error) throw error;

      // Update user streak and check for badges
      if (user) {
        await supabase.rpc('update_user_streak', { user_id: user.id });
        await supabase.rpc('check_and_award_badges', { user_id: user.id });
      }

      fetchEnrollments();
      return true;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  return {
    enrollments,
    loading,
    enrollInCourse,
    updateProgress,
    refetch: fetchEnrollments,
  };
};
