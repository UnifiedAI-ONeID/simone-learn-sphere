
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order_index: number;
  estimated_duration: number;
  lesson_type: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export const useLessons = (courseId: string) => {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLessons = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to fetch lessons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (lessonId: string, timeSpent: number = 0) => {
    try {
      const { error } = await supabase
        .from('lesson_completions')
        .insert({
          lesson_id: lessonId,
          time_spent: timeSpent,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson completed!",
      });

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
    fetchLessons();
  }, [courseId]);

  return {
    lessons,
    loading,
    completeLesson,
    refetch: fetchLessons,
  };
};
