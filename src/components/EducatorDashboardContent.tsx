
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  BarChart3,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const EducatorDashboardContent = () => {
  // Mock data - in real app, this would come from hooks
  let activeCourses = 1;
  let totalStudents = 45;
  let totalLessons = 12;
  let engagementRate = 78;

  return (
    <div className="space-y-6">
      {/* Welcome Message for New Educators */}
      {activeCourses === 0 && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900">
                  <LocalizedText text="Welcome, Educator!" />
                </h3>
                <p className="text-green-700 mt-1">
                  <LocalizedText text="Start sharing your knowledge by creating your first course. Our AI tools will help you every step of the way." />
                </p>
                <div className="flex gap-3 mt-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    <LocalizedText text="Create Course" />
                  </Button>
                  <Button variant="outline">
                    <LocalizedText text="Course Templates" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Encouragement for Growing */}
      {activeCourses > 0 && totalStudents < 100 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  <LocalizedText text="Growing Impact!" />
                </p>
                <p className="text-sm text-blue-600">
                  <LocalizedText text="Your courses are gaining traction. Consider creating more content to reach even more students!" />
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
              <LocalizedText text="Active Courses" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Published and running" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Students" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Across all courses" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Lessons" />
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLessons}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Created content" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Engagement Rate" />
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Student completion rate" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <LocalizedText text="Course Performance" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Student engagement and progress" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCourses > 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>React Fundamentals</span>
                    <span>92% completion</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">25 active students</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      <LocalizedText text="Top Performing Course" />
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    <LocalizedText text="Students love this course! Consider creating advanced content." />
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  <LocalizedText text="No courses created yet" />
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <LocalizedText text="Create your first course to see performance metrics here" />
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  <LocalizedText text="Create Course" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <LocalizedText text="Recent Activity" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Latest updates from your courses" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeCourses > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">3 new enrollments</p>
                    <p className="text-xs text-gray-500">React Fundamentals - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Lesson completed by 5 students</p>
                    <p className="text-xs text-gray-500">JavaScript Basics - Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Star className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">New 5-star review received</p>
                    <p className="text-xs text-gray-500">React Fundamentals - 2 days ago</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  <LocalizedText text="No activity yet" />
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  <LocalizedText text="Course activity will appear here once you start teaching" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Course Creation CTA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900">
                <LocalizedText text="AI-Powered Course Creation" />
              </h3>
              <p className="text-purple-700 mt-1">
                <LocalizedText text="Use our advanced AI tools to generate course outlines, create engaging content, and build interactive assessments in minutes." />
              </p>
              <div className="flex gap-3 mt-3">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <LocalizedText text="Try AI Course Builder" />
                </Button>
                <Button variant="outline">
                  <LocalizedText text="View Templates" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
