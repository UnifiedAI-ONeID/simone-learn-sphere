
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star, 
  PlusCircle, 
  TrendingUp, 
  Eye, 
  MessageSquare,
  Settings,
  RefreshCw,
  AlertTriangle,
  Brain,
  BarChart3
} from 'lucide-react';
import { useEducatorDashboardData } from '@/hooks/useDashboardData';

export const EducatorDashboardContent = () => {
  const navigate = useNavigate();
  const { data: educatorData, loading, error, refetch } = useEducatorDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load educator data. Please try again.
          <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!educatorData || educatorData.totalCourses === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <BookOpen className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              Welcome to Your Teaching Journey!
            </CardTitle>
            <CardDescription className="text-lg">
              Start creating courses and sharing your knowledge with the world
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Create your first course to begin your journey as an educator on our platform
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/educator/course/create')}
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Course
              </Button>
              <Button variant="outline" onClick={() => navigate('/educator/ai-planner')}>
                <Brain className="h-5 w-5 mr-2" />
                Use AI Course Planner
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips for New Educators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    AI Course Builder
                  </CardTitle>
                  <CardDescription>
                    Let AI help you create courses
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use our AI to generate course outlines, lesson plans, and quizzes from your expertise
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Student Engagement
                  </CardTitle>
                  <CardDescription>
                    Build an engaged community
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with students through discussions, Q&A, and personalized feedback
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Earn Revenue
                  </CardTitle>
                  <CardDescription>
                    Monetize your expertise
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set your course prices and earn revenue from students around the world
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Educator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your courses and track student progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/educator/course/create')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educatorData.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Published courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educatorData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${educatorData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educatorData.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Course rating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                My Courses
              </CardTitle>
              <Button size="sm" onClick={() => navigate('/educator/courses')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {educatorData.courses.slice(0, 3).map((course) => (
                <div key={course.id} className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                     onClick={() => navigate(`/educator/course/${course.id}`)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant={course.published ? 'default' : 'secondary'}>
                        {course.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{course.students} students</span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {course.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>
              Recent Enrollments
            </CardTitle>
            <CardDescription>
              Latest students who joined your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {educatorData.recentEnrollments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No recent enrollments. Promote your courses to attract more students!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {educatorData.recentEnrollments.slice(0, 5).map((enrollment, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{enrollment.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{enrollment.studentName}</p>
                      <p className="text-xs text-muted-foreground">{enrollment.courseName}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
