
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useStudentDashboardData } from '@/hooks/useDashboardData';

export const MobileStudentDashboard = () => {
  const { data: studentData, loading, error, refetch } = useStudentDashboardData();

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
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
      </div>
    );
  }

  if (!studentData || studentData.enrolledCourses === 0) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        {/* Dashboard Header */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              <UnifiedLocalizedText text="Welcome to Your Learning Journey!" />
            </h2>
            <p className="text-gray-600">
              <UnifiedLocalizedText text="Start by enrolling in your first course to begin tracking your progress." />
            </p>
          </CardContent>
        </Card>

        {/* Getting Started Actions */}
        <div className="space-y-3">
          <Card className="bg-white/70 backdrop-blur-sm border-blue-100 active:scale-95 transition-transform">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    <UnifiedLocalizedText text="Browse Courses" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    <UnifiedLocalizedText text="Discover courses that match your interests" />
                  </p>
                </div>
                <Button size="sm">
                  <UnifiedLocalizedText text="Explore" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-100 active:scale-95 transition-transform">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    <UnifiedLocalizedText text="Start Learning" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    <UnifiedLocalizedText text="Enroll in a course to begin your journey" />
                  </p>
                </div>
                <Badge variant="outline">
                  <UnifiedLocalizedText text="Free" />
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Dashboard Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            <UnifiedLocalizedText text="Welcome Back!" />
          </h2>
          <p className="text-gray-600">
            <UnifiedLocalizedText text="Continue your learning journey and track your progress." />
          </p>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/70 backdrop-blur-sm border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  <UnifiedLocalizedText text="Enrolled Courses" />
                </h3>
                <p className="text-sm text-gray-600">{studentData.enrolledCourses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  <UnifiedLocalizedText text="Lessons Completed" />
                </h3>
                <p className="text-sm text-gray-600">{studentData.completedLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <UnifiedLocalizedText text="Learning Progress" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Your current learning statistics" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                <UnifiedLocalizedText text="Current Streak" />
              </span>
              <span className="text-sm text-gray-600">{studentData.currentStreak} days</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                <UnifiedLocalizedText text="Total Points" />
              </span>
              <span className="text-sm text-gray-600">{studentData.totalPoints}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                <UnifiedLocalizedText text="Badges Earned" />
              </span>
              <span className="text-sm text-gray-600">{studentData.badges.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Courses */}
      <Card className="bg-white/70 backdrop-blur-sm border-indigo-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <UnifiedLocalizedText text="Continue Learning" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {studentData.recentCourses.slice(0, 2).map((course) => (
              <Card key={course.id} className="bg-white/70 backdrop-blur-sm border-yellow-100 active:scale-95 transition-transform">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Play className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <div className="mt-2">
                        <Progress value={course.progress} className="h-1" />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.progress}% complete
                      </p>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      <UnifiedLocalizedText text="Resume" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {studentData.badges.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              <UnifiedLocalizedText text="Recent Achievements" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {studentData.badges.slice(0, 2).map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-white/50">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
