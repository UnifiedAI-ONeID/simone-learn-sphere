
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string;
  educator_id: string;
  category_id: string;
  difficulty_level: string;
  estimated_duration: number;
  thumbnail_url: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    icon: string;
  };
  pricing?: {
    price: number;
    currency: string;
    is_free: boolean;
    discount_percentage: number;
  };
  enrollment_count?: number;
  educator?: {
    first_name: string;
    last_name: string;
  };
}

export const useCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:course_categories(name, icon),
          pricing:course_pricing(price, currency, is_free, discount_percentage),
          educator:profiles!educator_id(first_name, last_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get enrollment counts for each course and format pricing
      const coursesWithCounts = await Promise.all(
        (data || []).map(async (course) => {
          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id);
          
          return {
            ...course,
            enrollment_count: count || 0,
            pricing: Array.isArray(course.pricing) && course.pricing.length > 0 
              ? course.pricing[0] 
              : { price: 0, currency: 'USD', is_free: true, discount_percentage: 0 }
          };
        })
      );

      setCourses(coursesWithCounts);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title || 'Untitled Course',
          description: courseData.description || '',
          educator_id: user.id,
          category_id: courseData.category_id,
          difficulty_level: courseData.difficulty_level || 'beginner',
          estimated_duration: courseData.estimated_duration || 1,
          thumbnail_url: courseData.thumbnail_url || '',
          tags: courseData.tags || [],
          is_published: courseData.is_published || false,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      fetchCourses();
      return data;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCourse = async (courseId: string, updates: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: updates.title,
          description: updates.description,
          category_id: updates.category_id,
          difficulty_level: updates.difficulty_level,
          estimated_duration: updates.estimated_duration,
          thumbnail_url: updates.thumbnail_url,
          tags: updates.tags,
          is_published: updates.is_published,
        })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      fetchCourses();
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

  const deleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      fetchCourses();
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
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    refetch: fetchCourses,
  };
};
