
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface CourseProgress {
  course_id: string;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  last_activity: string;
}

export const CourseProgressTracking = () => {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCourseProgress = async () => {
      try {
        // Get courses with progress data
        const { data: courses } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            lessons(count),
            lesson_completions!inner(
              lesson_id,
              completed_at
            )
          `)
          .eq('is_published', true);

        if (courses) {
          const progressData: CourseProgress[] = await Promise.all(
            courses.map(async (course: any) => {
              // Get total lessons for this course
              const { count: totalLessons } = await supabase
                .from('lessons')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id);

              // Get completed lessons for this user
              const { data: completions } = await supabase
                .from('lesson_completions')
                .select('lesson_id, completed_at')
                .eq('user_id', user.id)
                .in('lesson_id', course.lessons?.map((l: any) => l.id) || []);

              const completedLessons = completions?.length || 0;
              const completion = totalLessons ? (completedLessons / totalLessons) * 100 : 0;
              
              const lastCompletion = completions?.sort((a, b) => 
                new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
              )[0];

              return {
                course_id: course.id,
                course_title: course.title,
                total_lessons: totalLessons || 0,
                completed_lessons: completedLessons,
                completion_percentage: completion,
                last_activity: lastCompletion?.completed_at || course.created_at
              };
            })
          );

          setCourseProgress(progressData.filter(p => p.total_lessons > 0));
        }
      } catch (error) {
        console.error('Failed to fetch course progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseProgress();

    // Set up real-time subscription for lesson completions
    const channel = supabase
      .channel('course-progress')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'lesson_completions',
        filter: `user_id=eq.${user.id}`
      }, fetchCourseProgress)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="pt-6">
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = courseProgress.length > 0 
    ? courseProgress.reduce((sum, course) => sum + course.completion_percentage, 0) / courseProgress.length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Learning Progress Overview</span>
          </CardTitle>
          <CardDescription>
            Track your learning journey and course completions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{courseProgress.length}</p>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{overallProgress.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {courseProgress.reduce((sum, course) => sum + course.completed_lessons, 0)}
              </p>
              <p className="text-sm text-gray-600">Lessons Completed</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Overall Learning Progress: {overallProgress.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courseProgress.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Courses Found</h3>
                <p className="text-gray-600">
                  Start your learning journey by enrolling in courses!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          courseProgress.map((course) => (
            <Card key={course.course_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{course.course_title}</span>
                  <Badge 
                    variant={course.completion_percentage === 100 ? "default" : "secondary"}
                    className={course.completion_percentage === 100 ? "bg-green-500" : ""}
                  >
                    {course.completion_percentage === 100 ? "Complete" : "In Progress"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{course.completed_lessons} / {course.total_lessons} lessons</span>
                    </span>
                    <span className="font-semibold">{course.completion_percentage.toFixed(1)}%</span>
                  </div>
                  
                  <Progress value={course.completion_percentage} className="w-full" />
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Last activity</span>
                    </span>
                    <span>{new Date(course.last_activity).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
