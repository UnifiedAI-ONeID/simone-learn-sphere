import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from 'lucide-react';
import { useStudentAnalytics } from '@/hooks/useStudentAnalytics';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const MobileStudentDashboard = () => {
  const { totalCourses, coursesInProgress, completedCourses, timeSpentLearning } = useStudentAnalytics();

  useEffect(() => {
    // Simulate fetching analytics data
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Dashboard Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            <UnifiedLocalizedText text="Welcome to Your Dashboard!" />
          </h2>
          <p className="text-gray-600">
            <UnifiedLocalizedText text="Track your progress and stay motivated." />
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
                  <UnifiedLocalizedText text="Total Courses" />
                </h3>
                <p className="text-sm text-gray-600">{totalCourses}</p>
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
                  <UnifiedLocalizedText text="Time Spent Learning" />
                </h3>
                <p className="text-sm text-gray-600">{timeSpentLearning} <UnifiedLocalizedText text="hours" /></p>
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
            <UnifiedLocalizedText text="Track your course progress" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                <UnifiedLocalizedText text="Courses In Progress" />
              </span>
              <span className="text-sm text-gray-600">{coursesInProgress}</span>
            </div>
            <Progress value={(coursesInProgress / totalCourses) * 100} />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                <UnifiedLocalizedText text="Completed Courses" />
              </span>
              <span className="text-sm text-gray-600">{completedCourses}</span>
            </div>
            <Progress value={(completedCourses / totalCourses) * 100} />
          </div>
        </CardContent>
      </Card>

      {/* Actionable Items */}
      <div className="space-y-3">
        <Card className="bg-white/70 backdrop-blur-sm border-yellow-100 active:scale-95 transition-transform">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  <UnifiedLocalizedText text="Continue Learning" />
                </h3>
                <p className="text-sm text-gray-600">
                  <UnifiedLocalizedText text="Pick up where you left off" />
                </p>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                <UnifiedLocalizedText text="Resume" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-indigo-100 active:scale-95 transition-transform">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  <UnifiedLocalizedText text="Upcoming Deadlines" />
                </h3>
                <p className="text-sm text-gray-600">
                  <UnifiedLocalizedText text="Stay on track with your assignments" />
                </p>
              </div>
              <Badge variant="outline">
                <UnifiedLocalizedText text="View All" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
