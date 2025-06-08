import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Star, 
  ChevronRight, 
  Calendar,
  Target,
  Sparkles,
  Plus
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const StudentDashboardContent = () => {
  const navigate = useNavigate();
  
  // Simulate checking if user has any data - in real app this would come from props/hooks
  const hasAnyActivity = false; // This should be determined by actual user data
  const totalXP = 0;
  const currentStreak = 0;
  const totalLessonsCompleted = 0;
  const averageQuizScore = 0;
  const enrolledCourses = [];

  // Show encouraging empty states for new users
  if (!hasAnyActivity && enrolledCourses.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              <UnifiedLocalizedText text="Welcome to Your Learning Journey!" />
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              <UnifiedLocalizedText text="You're about to embark on an amazing adventure of knowledge and growth" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              <UnifiedLocalizedText text="Start by exploring our course catalog and enrolling in your first course" />
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/student/courses')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <UnifiedLocalizedText text="Browse Courses" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/student/courses')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="Browse Courses" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Find your perfect learning path" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Explore hundreds of courses across different subjects and skill levels" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/student/ai-tutor')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="AI Study Assistant" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Get personalized help anytime" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Ask questions and get instant, personalized learning support" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/student/study-groups')}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <UnifiedLocalizedText text="Study Groups" />
                  </CardTitle>
                  <CardDescription>
                    <UnifiedLocalizedText text="Learn with peers" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Join study groups and collaborate with fellow learners" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motivation Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-red-500" />
              <UnifiedLocalizedText text="Why Learning Matters" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      <UnifiedLocalizedText text="Build Confidence" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <UnifiedLocalizedText text="Every lesson completed is a step towards mastering new skills" />
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      <UnifiedLocalizedText text="Advance Your Career" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <UnifiedLocalizedText text="Gain valuable skills that employers are looking for" />
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      <UnifiedLocalizedText text="Learn at Your Pace" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <UnifiedLocalizedText text="Flexible learning that fits your schedule and lifestyle" />
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-foreground">
                      <UnifiedLocalizedText text="Achieve Your Goals" />
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      <UnifiedLocalizedText text="Transform your aspirations into reality with structured learning" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active user dashboard with data
  const myLearningData = [
    { id: 1, title: 'React Fundamentals', progress: 75, totalLessons: 24, completedLessons: 18, nextDeadline: '2 days', status: 'active' },
    { id: 2, title: 'JavaScript ES6+', progress: 45, totalLessons: 18, completedLessons: 8, nextDeadline: '5 days', status: 'active' },
    { id: 3, title: 'CSS Grid & Flexbox', progress: 90, totalLessons: 12, completedLessons: 11, nextDeadline: 'Completed', status: 'completed' }
  ];

  const upcomingDeadlines = [
    { title: 'React State Management Quiz', course: 'React Fundamentals', dueDate: 'Tomorrow', type: 'quiz', courseId: 1 },
    { title: 'Portfolio Project Submission', course: 'JavaScript ES6+', dueDate: 'Friday', type: 'project', courseId: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/streak')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Daily Streak" />
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7 days</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Keep it going!" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Total XP" />
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,250</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Level 5" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Courses Active" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="2 in progress" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/badges')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Badges Earned" />
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="3 this week" />
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
              <Button size="sm" onClick={() => navigate('/student/courses')}>
                <Plus className="h-4 w-4 mr-2" />
                Browse More
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myLearningData.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg bg-background cursor-pointer hover:bg-accent transition-colors"
                   onClick={() => navigate(`/student/course/${course.id}`)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Badge variant={course.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                      {course.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {course.status === 'completed' ? 'Review' : 'Continue'}
                  </Button>
                </div>
                
                <Progress value={course.progress} className="mb-3" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.nextDeadline}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5" />
              <UnifiedLocalizedText text="Upcoming Deadlines" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Stay on track with your assignments" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-3 border border-border rounded-lg bg-background cursor-pointer hover:bg-accent transition-colors"
                   onClick={() => navigate(`/student/course/${deadline.courseId}/assignments`)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">{deadline.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {deadline.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{deadline.dueDate}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" onClick={() => navigate('/student/assignments')}>
              <Activity className="h-4 w-4 mr-2" />
              View All Deadlines
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/ai-tutor')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5" />
              <UnifiedLocalizedText text="Ask AI Tutor" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="Get instant help with your studies" />
            </p>
            <Button className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/leaderboard')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="h-5 w-5" />
              <UnifiedLocalizedText text="Leaderboard" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="See how you rank among peers" />
            </p>
            <Button variant="outline" className="w-full">
              View Rankings
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/forums')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageSquare className="h-5 w-5" />
              <UnifiedLocalizedText text="Forums" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              <UnifiedLocalizedText text="Join discussions with classmates" />
            </p>
            <Button variant="outline" className="w-full">
              Browse Forums
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
