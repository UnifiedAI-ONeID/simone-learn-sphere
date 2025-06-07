
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { debounce } from 'lodash';

interface CourseDraft {
  id: string;
  user_id: string;
  course_data: any;
  title: string | null;
  last_saved_at: string;
  created_at: string;
}

export const useCourseDrafts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<CourseDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchDrafts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('last_saved_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (err: any) {
      console.error('Error fetching drafts:', err);
      toast({
        title: "Error",
        description: "Failed to fetch drafts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (courseData: any, title?: string) => {
    if (!user) return null;

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('course_drafts')
        .upsert({
          user_id: user.id,
          course_data: courseData,
          title: title || courseData.title || 'Untitled Course',
          last_saved_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error saving draft:', err);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce((courseData: any, title?: string) => {
      saveDraft(courseData, title);
    }, 2000),
    [user]
  );

  const deleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('course_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Draft deleted successfully",
      });

      fetchDrafts();
    } catch (err: any) {
      console.error('Error deleting draft:', err);
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [user]);

  return {
    drafts,
    loading,
    saving,
    saveDraft,
    debouncedSave,
    deleteDraft,
    refetch: fetchDrafts,
  };
};
