
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  lesson_type: string;
  order_index: number;
  estimated_duration: number | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useModules = (courseId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          lessons (
            id,
            title,
            content,
            lesson_type,
            order_index,
            estimated_duration,
            video_url,
            created_at,
            updated_at
          )
        `)
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      console.error('Error fetching modules:', err);
      toast({
        title: "Error",
        description: "Failed to fetch modules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (moduleData: Partial<Module>) => {
    if (!user || !courseId) return null;

    try {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: moduleData.title || 'New Module',
          description: moduleData.description || '',
          order_index: modules.length + 1,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module created successfully",
      });

      return data;
    } catch (err: any) {
      console.error('Error creating module:', err);
      toast({
        title: "Error",
        description: "Failed to create module",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateModule = async (moduleId: string, updates: Partial<Module>) => {
    try {
      const { error } = await supabase
        .from('modules')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module updated successfully",
      });

      return true;
    } catch (err: any) {
      console.error('Error updating module:', err);
      toast({
        title: "Error",
        description: "Failed to update module",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Module deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting module:', err);
      toast({
        title: "Error",
        description: "Failed to delete module",
        variant: "destructive",
      });
      return false;
    }
  };

  const createLesson = async (moduleId: string, lessonData: Partial<Lesson>) => {
    if (!user) return null;

    try {
      const module = modules.find(m => m.id === moduleId);
      const lessonCount = module?.lessons?.length || 0;

      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          course_id: courseId,
          title: lessonData.title || 'New Lesson',
          content: lessonData.content || '',
          lesson_type: lessonData.lesson_type || 'text',
          order_index: lessonCount + 1,
          estimated_duration: lessonData.estimated_duration || 15,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson created successfully",
      });

      return data;
    } catch (err: any) {
      console.error('Error creating lesson:', err);
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive",
      });
      return null;
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!courseId) return;

    fetchModules();

    const channel = supabase
      .channel('modules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modules',
          filter: `course_id=eq.${courseId}`,
        },
        () => {
          console.log('Modules changed, refetching...');
          fetchModules();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lessons',
        },
        () => {
          console.log('Lessons changed, refetching...');
          fetchModules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [courseId]);

  return {
    modules,
    loading,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    refetch: fetchModules,
  };
};
