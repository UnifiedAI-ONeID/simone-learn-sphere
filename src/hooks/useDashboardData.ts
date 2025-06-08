
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface StudentDashboardData {
  enrolledCourses: number;
  completedLessons: number;
  currentStreak: number;
  totalPoints: number;
  recentCourses: Array<{
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
  }>;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
  }>;
}

export interface EducatorDashboardData {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  courses: Array<{
    id: string;
    title: string;
    students: number;
    revenue: number;
    rating: number;
    published: boolean;
  }>;
  recentEnrollments: Array<{
    studentName: string;
    courseName: string;
    enrolledAt: string;
  }>;
}

export interface AdminDashboardData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalCourses: number;
  usersByRole: {
    students: number;
    educators: number;
    admins: number;
  };
  recentActivities: Array<{
    type: string;
    message: string;
    user: string;
    time: string;
  }>;
  systemMetrics: Array<{
    name: string;
    value: number;
    status: 'healthy' | 'warning' | 'error';
  }>;
}

export const useStudentDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch enrolled courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('course_enrollments')
          .select(`
            *,
            courses (
              id,
              title,
              thumbnail_url
            )
          `)
          .eq('user_id', user.id);

        if (enrollmentsError) throw enrollmentsError;

        // Fetch completed lessons
        const { data: completions, error: completionsError } = await supabase
          .from('lesson_completions')
          .select('*')
          .eq('user_id', user.id);

        if (completionsError) throw completionsError;

        // Fetch user streak
        const { data: streak, error: streakError } = await supabase
          .from('user_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (streakError && streakError.code !== 'PGRST116') throw streakError;

        // Fetch user badges
        const { data: userBadges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            *,
            badges (
              id,
              name,
              icon
            )
          `)
          .eq('user_id', user.id);

        if (badgesError) throw badgesError;

        const dashboardData: StudentDashboardData = {
          enrolledCourses: enrollments?.length || 0,
          completedLessons: completions?.length || 0,
          currentStreak: streak?.current_streak || 0,
          totalPoints: (completions?.length || 0) * 10, // 10 points per lesson
          recentCourses: enrollments?.slice(0, 3).map(enrollment => ({
            id: enrollment.courses?.id || '',
            title: enrollment.courses?.title || '',
            progress: enrollment.progress_percentage || 0,
            lastAccessed: enrollment.last_accessed_at || enrollment.enrolled_at
          })) || [],
          badges: userBadges?.map(ub => ({
            id: ub.badges?.id || '',
            name: ub.badges?.name || '',
            icon: ub.badges?.icon || '',
            earnedAt: ub.earned_at
          })) || []
        };

        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching student dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
};

export const useEducatorDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EducatorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch educator's courses
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .eq('educator_id', user.id);

        if (coursesError) throw coursesError;

        // Fetch enrollments for educator's courses
        const courseIds = courses?.map(course => course.id) || [];
        let enrollments: any[] = [];
        let enrollmentProfiles: any[] = [];

        if (courseIds.length > 0) {
          const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('course_enrollments')
            .select('*')
            .in('course_id', courseIds);

          if (enrollmentError) throw enrollmentError;
          enrollments = enrollmentData || [];

          // Fetch profiles for enrolled users
          const userIds = enrollments.map(enrollment => enrollment.user_id);
          if (userIds.length > 0) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name')
              .in('id', userIds);

            if (profileError) throw profileError;
            enrollmentProfiles = profileData || [];
          }
        }

        const totalStudents = enrollments.length;

        // Create recent enrollments with proper student names
        const recentEnrollments = enrollments
          .slice(0, 10)
          .map(enrollment => {
            const profile = enrollmentProfiles.find(p => p.id === enrollment.user_id);
            const course = courses?.find(c => c.id === enrollment.course_id);
            
            return {
              studentName: profile 
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous'
                : 'Anonymous',
              courseName: course?.title || 'Unknown Course',
              enrolledAt: enrollment.enrolled_at
            };
          });

        const dashboardData: EducatorDashboardData = {
          totalCourses: courses?.length || 0,
          totalStudents,
          totalRevenue: 0, // Would calculate from pricing and enrollments
          avgRating: 4.5, // Would calculate from course ratings
          courses: courses?.map(course => ({
            id: course.id,
            title: course.title,
            students: enrollments.filter(e => e.course_id === course.id).length,
            revenue: 0, // Would calculate from pricing
            rating: 4.5, // Would fetch from ratings
            published: course.is_published
          })) || [],
          recentEnrollments
        };

        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching educator dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
};

export const useAdminDashboardData = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user counts by role
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('role');

        if (profilesError) throw profilesError;

        // Fetch total courses
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id');

        if (coursesError) throw coursesError;

        // Fetch recent security events
        const { data: securityEvents, error: securityError } = await supabase
          .from('security_audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (securityError) throw securityError;

        const usersByRole = profiles?.reduce((acc, profile) => {
          acc[profile.role === 'student' ? 'students' : 
              profile.role === 'educator' ? 'educators' : 'admins']++;
          return acc;
        }, { students: 0, educators: 0, admins: 0 }) || { students: 0, educators: 0, admins: 0 };

        const dashboardData: AdminDashboardData = {
          totalUsers: profiles?.length || 0,
          activeUsers: Math.floor((profiles?.length || 0) * 0.7), // Estimate 70% active
          totalRevenue: 0, // Would calculate from all transactions
          totalCourses: courses?.length || 0,
          usersByRole,
          recentActivities: securityEvents?.map(event => ({
            type: event.event_type,
            message: event.event_type.replace(/_/g, ' '),
            user: event.user_id || 'System',
            time: event.created_at
          })) || [],
          systemMetrics: [
            { name: 'API Uptime', value: 99.9, status: 'healthy' },
            { name: 'Database Performance', value: 95, status: 'healthy' },
            { name: 'CDN Response Time', value: 85, status: 'warning' }
          ]
        };

        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
