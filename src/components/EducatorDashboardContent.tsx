
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Star,
  Heart,
  Trophy,
  Zap,
  PlusCircle,
  Edit,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const EducatorDashboardContent = () => {
  const navigate = useNavigate();
  
  // Simulate checking if educator has created any courses
  const hasCreatedCourses = false; // This should be determined by actual user data
  const totalRevenue = 0;
  const myCourses = [];

  // Show encouraging empty state for new educators
  if (!hasCreatedCourses && myCourses.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Rocket className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              <UnifiedLocalizedText text="Welcome, Educator!" />
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              <UnifiedLocalizedText text="Ready to inspire and educate the next generation of learners?" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              <UnifiedLocalizedText text="Share your knowledge and passion with students worldwide" />
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/educator/course/create')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              <UnifiedLocalizedText text="Create Your First Course" />
            </Button>
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <UnifiedLocalizedText text="Getting Started as an Educator" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Follow these simple steps to launch your teaching journey" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <UnifiedLocalizedText text="Plan Your Course" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Use our AI Course Planner to structure your curriculum and learning objectives" />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/educator/ai-planner')}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    <UnifiedLocalizedText text="Try AI Planner" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <UnifiedLocalizedText text="Create Content" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Build engaging lessons with our AI Content Generator or create from scratch" />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/educator/ai-content')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <UnifiedLocalizedText text="Generate Content" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <UnifiedLocalizedText text="Publish & Share" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Launch your course and start making an impact on students' lives" />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/educator/course/create')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    <UnifiedLocalizedText text="Course Builder" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="Earn Revenue" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Monetize your expertise" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Set your own pricing and earn money from course enrollments while helping others learn" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="Global Reach" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Teach students worldwide" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Connect with learners from around the globe and build an international community" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="AI-Powered Tools" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Smart content creation" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Leverage AI to create course outlines, generate content, and enhance your teaching" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inspiration Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-red-500" />
              <UnifiedLocalizedText text="Make a Difference" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                <UnifiedLocalizedText text="Every course you create has the potential to change someone's life" />
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <p className="text-sm text-muted-foreground">
                    <UnifiedLocalizedText text="Impact Lives" />
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">🌍</div>
                  <p className="text-sm text-muted-foreground">
                    <UnifiedLocalizedText text="Global Classroom" />
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">🚀</div>
                  <p className="text-sm text-muted-foreground">
                    <UnifiedLocalizedText text="Limitless Growth" />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active educator dashboard with courses
  const activeCourses = [
    { 
      id: 1, 
      title: 'React for Beginners', 
      students: 234, 
      revenue: 2340, 
      rating: 4.8, 
      status: 'published',
      lastUpdated: '2 days ago'
    },
    { 
      id: 2, 
      title: 'Advanced JavaScript', 
      students: 89, 
      revenue: 890, 
      rating: 4.6, 
      status: 'draft',
      lastUpdated: '1 week ago'
    }
  ];

  const recentActivity = [
    { type: 'enrollment', message: '5 new students enrolled in React for Beginners', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review on Advanced JavaScript', time: '1 day ago' },
    { type: 'message', message: '3 new student questions in course forums', time: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Total Students" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">323</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="+12 this week" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/educator/revenue')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Total Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$3,230</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="+$420 this month" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Active Courses" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="2 published" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Avg Rating" />
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.7</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Based on 89 reviews" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5" />
                <UnifiedLocalizedText text="My Courses" />
              </CardTitle>
              <Button size="sm" onClick={() => navigate('/educator/course/create')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCourses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg bg-background">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="mt-1">
                      {course.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/educator/course/${course.id}/analytics`)}>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/educator/course/${course.id}/editor`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-semibold">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-semibold">${course.revenue}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-semibold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated {course.lastUpdated}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5" />
              <UnifiedLocalizedText text="Recent Activity" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Latest updates from your courses" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/educator/activity')}>
              <Eye className="h-4 w-4 mr-2" />
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/educator/ai-assistant')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bot className="h-5 w-5" />
              <UnifiedLocalizedText text="AI Assistant" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="Generate quizzes, lesson plans, and content" />
            </p>
            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Open Assistant
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/educator/announcements')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5" />
              <UnifiedLocalizedText text="Announcements" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="Communicate with your students" />
            </p>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/educator/students')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              <UnifiedLocalizedText text="Student Insights" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="Track engagement and progress" />
            </p>
            <Button variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
