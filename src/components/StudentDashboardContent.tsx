
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  TrendingUp,
  Play,
  CheckCircle
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudentDashboardContent = () => {
  // Mock data - in real app, this would come from hooks
  const enrolledCourses = 2;
  const completedLessons = 15;
  const totalLessons = 45;
  const streakDays = 7;
  const badges = 3;

  const completionRate = (completedLessons / totalLessons) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Message for New Students */}
      {enrolledCourses === 0 && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900">
                  <LocalizedText text="Welcome to Your Learning Journey!" />
                </h3>
                <p className="text-blue-700 mt-1">
                  <LocalizedText text="Start by exploring our course catalog and enrolling in subjects that interest you." />
                </p>
                <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <LocalizedText text="Browse Courses" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Encouragement */}
      {enrolledCourses > 0 && completionRate < 50 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  <LocalizedText text="Keep Going!" />
                </p>
                <p className="text-sm text-green-600">
                  <LocalizedText text="You're making great progress. Stay consistent to reach your learning goals!" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Enrolled Courses" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Active learning paths" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Lessons Completed" />
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedLessons}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Out of" /> {totalLessons} <LocalizedText text="total" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Learning Streak" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakDays}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Days in a row" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Badges Earned" />
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Achievements unlocked" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <LocalizedText text="Learning Progress" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Your overall completion rate" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span><LocalizedText text="Overall Progress" /></span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            {enrolledCourses > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React Fundamentals</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>JavaScript Mastery</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  <LocalizedText text="No courses enrolled yet" />
                </p>
                <Button className="mt-2" variant="outline">
                  <LocalizedText text="Start Learning" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <LocalizedText text="Recent Activity" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Your latest learning milestones" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedLessons > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Completed: React Components</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Trophy className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Earned: Quick Learner Badge</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Play className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Started: JavaScript Arrays</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  <LocalizedText text="No activity yet" />
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <LocalizedText text="Start a course to see your progress here" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Call to Action */}
      {enrolledCourses === 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6 text-center">
            <Trophy className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-900 mb-2">
              <LocalizedText text="Ready to Start Learning?" />
            </h3>
            <p className="text-purple-700 mb-4">
              <LocalizedText text="Join thousands of students already advancing their skills with our AI-powered platform." />
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <BookOpen className="h-4 w-4 mr-2" />
                <LocalizedText text="Explore Courses" />
              </Button>
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                <LocalizedText text="View Popular Courses" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
