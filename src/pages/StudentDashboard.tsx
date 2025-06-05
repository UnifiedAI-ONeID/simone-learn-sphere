
import { DashboardHeader } from '@/components/DashboardHeader';
import { ImpersonationBanner } from '@/components/ImpersonationBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Trophy, TrendingUp, Play, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  // Mock data for demonstration
  const mockCourses = [
    {
      id: 1,
      title: "Introduction to React",
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      instructor: "Jane Smith",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      progress: 45,
      totalLessons: 15,
      completedLessons: 7,
      instructor: "John Doe",
      category: "Programming"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      instructor: "Sarah Wilson",
      category: "Design"
    }
  ];

  const stats = [
    {
      title: "Courses Enrolled",
      value: "3",
      icon: BookOpen,
      description: "Active courses"
    },
    {
      title: "Hours Learned",
      value: "47",
      icon: Clock,
      description: "This month"
    },
    {
      title: "Certificates",
      value: "1",
      icon: Trophy,
      description: "Completed"
    },
    {
      title: "Average Progress",
      value: "73%",
      icon: TrendingUp,
      description: "Across all courses"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ImpersonationBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          title="Student Dashboard"
          subtitle="Continue your learning journey"
        />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              Continue learning from where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <Badge variant="secondary">{course.category}</Badge>
                      {course.progress === 100 && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Instructor: {course.instructor}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {course.completedLessons}/{course.totalLessons} lessons
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button 
                      variant={course.progress === 100 ? "outline" : "default"}
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {course.progress === 100 ? "Review" : "Continue"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
