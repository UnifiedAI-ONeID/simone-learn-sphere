
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Plus, BarChart3, Brain, Settings, Eye, MessageSquare } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileEducatorDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_educator_dashboard');
  }, [trackPageView]);

  const courses = [
    { id: 1, title: 'React Fundamentals', students: 45, progress: 78, status: 'Published', revenue: '$1,200' },
    { id: 2, title: 'JavaScript Basics', students: 32, progress: 65, status: 'Published', revenue: '$890' },
    { id: 3, title: 'Advanced CSS', students: 28, progress: 90, status: 'Draft', revenue: '$0' },
  ];

  const recentActivity = [
    { type: 'enrollment', message: '3 new students enrolled in React Fundamentals', time: '2h ago' },
    { type: 'completion', message: '15 students completed Module 3', time: '4h ago' },
    { type: 'question', message: '2 new questions in Q&A forum', time: '6h ago' },
  ];

  const analytics = {
    totalRevenue: '$3,450',
    monthlyGrowth: '+15%',
    studentSatisfaction: '4.8/5',
    completionRate: '89%'
  };

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            <LocalizedText text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-xs">
            <LocalizedText text="Courses" />
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            <LocalizedText text="Analytics" />
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="text-xs">
            <LocalizedText text="AI Tools" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Active Courses" />
                    </p>
                    <p className="text-lg font-semibold">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Students" />
                    </p>
                    <p className="text-lg font-semibold">127</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                <LocalizedText text="Create New Course" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="View Analytics" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Course Planner" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Recent Activity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              <LocalizedText text="My Courses" />
            </h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <LocalizedText text="New" />
            </Button>
          </div>

          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{course.title}</h4>
                  <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="font-semibold">{course.students}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-semibold">{course.revenue}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Completion Rate</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    <LocalizedText text="View" />
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    <LocalizedText text="Edit" />
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <LocalizedText text="Q&A" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-lg font-semibold">{analytics.totalRevenue}</p>
                <p className="text-xs text-green-500">{analytics.monthlyGrowth}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xs text-gray-500">Satisfaction</p>
                <p className="text-lg font-semibold">{analytics.studentSatisfaction}</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Course Performance" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.filter(c => c.status === 'Published').map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{course.title}</span>
                    <span className="text-xs text-gray-500">{course.students} students</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Completion: {course.progress}%</span>
                    <span>Revenue: {course.revenue}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI-Powered Tools" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Generate Course Outline" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                <LocalizedText text="Create Lesson Content" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Generate Quiz Questions" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="Analyze Student Performance" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="AI Insights" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm">Course Improvement Suggestion</p>
                <p className="text-xs text-gray-600 mt-1">
                  Students in React Fundamentals are struggling with hooks. Consider adding more interactive examples.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-sm">Trending Topic</p>
                <p className="text-xs text-gray-600 mt-1">
                  TypeScript is trending. Consider creating a course to capitalize on demand.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
