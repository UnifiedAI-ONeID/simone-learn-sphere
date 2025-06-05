import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CourseProgressTracking } from '@/components/CourseProgressTracking';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock, 
  TrendingUp,
  GraduationCap,
  Target,
  Calendar
} from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';

const StudentDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking(); // Automatically tracks session

  useEffect(() => {
    trackPageView('student_dashboard');
  }, [trackPageView]);

  const upcomingLessons = [
    { id: 1, title: "Introduction to React Hooks", course: "React Masterclass", duration: "45 min", dueDate: "Today" },
    { id: 2, title: "State Management with Context", course: "React Masterclass", duration: "60 min", dueDate: "Tomorrow" },
    { id: 3, title: "Building Responsive Layouts", course: "CSS Advanced", duration: "30 min", dueDate: "This Week" }
  ];

  const achievements = [
    { id: 1, title: "First Lesson Complete", description: "Completed your first lesson", earned: true },
    { id: 2, title: "Week Warrior", description: "Completed 5 lessons in one week", earned: true },
    { id: 3, title: "Course Master", description: "Completed your first course", earned: false },
    { id: 4, title: "Consistent Learner", description: "7-day learning streak", earned: false }
  ];

  const stats = {
    coursesEnrolled: 3,
    lessonsCompleted: 42,
    totalHours: 38,
    currentStreak: 5
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        title="Student Dashboard 🎓"
        subtitle="Continue your learning journey"
        badgeText="Student"
        badgeIcon={GraduationCap}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">
              <TranslatedText text="Overview" />
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TranslatedText text="My Progress" />
            </TabsTrigger>
            <TabsTrigger value="courses">
              <TranslatedText text="Courses" />
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <TranslatedText text="Achievements" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <TranslatedText text="Courses Enrolled" />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <TranslatedText text="Lessons Completed" />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalHours}h</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <TranslatedText text="Learning Time" />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.currentStreak}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <TranslatedText text="Day Streak" />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <TranslatedText text="Continue Learning" />
                </CardTitle>
                <CardDescription>
                  <TranslatedText text="Pick up where you left off" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          <TranslatedText text={lesson.title} />
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                          <span><TranslatedText text={lesson.course} /></span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.duration}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <TranslatedText text={lesson.dueDate} />
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">
                        <Play className="w-4 h-4 mr-1" />
                        <TranslatedText text="Continue" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <CourseProgressTracking />
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>All your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Course Library</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your personalized course library coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>Track your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-4 border rounded-lg flex items-center space-x-3 ${
                        achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <Badge variant={achievement.earned ? "default" : "secondary"}>
                        {achievement.earned ? "Earned" : "Locked"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
