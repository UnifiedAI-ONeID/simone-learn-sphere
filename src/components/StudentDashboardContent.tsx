
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
  TrendingUp, 
  Clock, 
  Award, 
  Star, 
  ChevronRight, 
  Calendar,
  Target,
  Users,
  Heart,
  Trophy,
  Zap,
  Activity,
  MessageSquare,
  Brain,
  PlusCircle,
  Sparkles,
  Play,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useStudentDashboardData } from '@/hooks/useDashboardData';

export const StudentDashboardContent = () => {
  const navigate = useNavigate();
  const { data: studentData, loading, error, refetch } = useStudentDashboardData();

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
          <UnifiedLocalizedText text="Failed to load your dashboard data. Please try again." />
          <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Retry" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show encouraging empty states for new users
  if (!studentData || studentData.enrolledCourses === 0) {
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

  // Active user dashboard with real data
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/student/streak')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Current Streak" />
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{studentData.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Keep it going!" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Total Points" />
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{studentData.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Learning points earned" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Enrolled Courses" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{studentData.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Active courses" />
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
            <div className="text-2xl font-bold text-foreground">{studentData.badges.length}</div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Achievements unlocked" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5" />
                <UnifiedLocalizedText text="Continue Learning" />
              </CardTitle>
              <Button size="sm" onClick={() => navigate('/student/courses')}>
                <UnifiedLocalizedText text="View All" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentData.recentCourses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg bg-background cursor-pointer hover:bg-accent transition-colors"
                   onClick={() => navigate(`/student/course/${course.id}`)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Badge variant="secondary" className="mt-1">
                      In Progress
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
                
                <Progress value={course.progress} className="mb-3" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.progress}% complete</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(course.lastAccessed).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="h-5 w-5" />
              <UnifiedLocalizedText text="Recent Achievements" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Your latest badges and milestones" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentData.badges.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  <UnifiedLocalizedText text="Start learning to earn your first badge!" />
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentData.badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-background">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{badge.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Earned {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/student/badges')}>
                  <Award className="h-4 w-4 mr-2" />
                  View All Badges
                </Button>
              </div>
            )}
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
              <UnifiedLocalizedText text="AI Study Assistant" />
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
