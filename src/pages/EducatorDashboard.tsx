
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Brain,
  Star,
  TrendingUp
} from 'lucide-react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CourseCreator } from '@/components/CourseCreator';
import { EducatorAIAssistant } from '@/components/EducatorAIAssistant';

const EducatorDashboard = () => {
  const stats = {
    totalStudents: 450,
    totalRevenue: 8960,
    avgRating: 4.8,
    coursesPublished: 3
  };

  const recentActivity = [
    { type: 'enrollment', message: 'Sarah J. enrolled in AI-Powered Web Development', time: '2h ago' },
    { type: 'review', message: 'New 5-star review on Accessible Design Masterclass', time: '4h ago' },
    { type: 'question', message: 'Question posted in React for Beginners forum', time: '6h ago' },
    { type: 'completion', message: 'Mark T. completed Accessible Design Masterclass', time: '8h ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        title="Educator Dashboard"
        subtitle="Create courses and inspire learners worldwide"
        badgeText="Educator"
        badgeIcon={BookOpen}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Creator</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalStudents}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.avgRating}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.coursesPublished}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Published Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates from your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'question' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                        {activity.type === 'review' && <Star className="w-4 h-4" />}
                        {activity.type === 'question' && <Brain className="w-4 h-4" />}
                        {activity.type === 'completion' && <BookOpen className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <CourseCreator />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <EducatorAIAssistant />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>Track your course performance and student engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Comprehensive analytics dashboard coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducatorDashboard;
