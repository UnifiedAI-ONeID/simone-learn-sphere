
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Brain, BarChart3, Plus, DollarSign, MessageSquare, Settings, Eye, TrendingUp } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useEducatorDashboardData } from '@/hooks/useDashboardData';
import { LocalizedText } from '@/components/LocalizedText';
import { MobileAIChat } from '@/components/mobile/MobileAIChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const MobileEducatorDashboard = () => {
  const navigate = useNavigate();
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIChat, setShowAIChat] = useState(false);
  const { data, loading, error } = useEducatorDashboardData();
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_educator_dashboard');
  }, [trackPageView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Error loading dashboard: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            <LocalizedText text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-xs">
            <LocalizedText text="Courses" />
          </TabsTrigger>
          <TabsTrigger value="ai-planner" className="text-xs">
            <LocalizedText text="AI Plan" />
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            <LocalizedText text="Analytics" />
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs">
            <LocalizedText text="Students" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Courses" />
                    </p>
                    <p className="text-lg font-semibold">{data?.totalCourses || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Students" />
                    </p>
                    <p className="text-lg font-semibold">{data?.totalStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/educator/course/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                <LocalizedText text="Create New Course" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Course Planner" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/educator/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="View Analytics" />
              </Button>
            </CardContent>
          </Card>

          {data?.recentEnrollments && data.recentEnrollments.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <LocalizedText text="Recent Enrollments" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.recentEnrollments.slice(0, 3).map((enrollment, index) => (
                  <div key={index} className="text-sm border-l-2 border-blue-500 pl-3">
                    <p className="font-medium">{enrollment.studentName}</p>
                    <p className="text-muted-foreground text-xs">
                      {enrollment.courseName} • {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <LocalizedText text="Revenue Overview" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.totalRevenue && data.totalRevenue > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-2">
                    <LocalizedText text="No revenue data yet" />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <LocalizedText text="Create and publish courses to start earning" />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              <LocalizedText text="My Courses" />
            </h2>
            <Button 
              size="sm" 
              onClick={() => navigate('/educator/course/create')}
            >
              <Plus className="h-3 w-3 mr-1" />
              <LocalizedText text="New" />
            </Button>
          </div>

          {data?.courses && data.courses.length > 0 ? (
            <div className="space-y-3">
              {data.courses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{course.students} students</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => navigate(`/educator/course/${course.id}/analytics`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/educator/course/${course.id}/edit`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-3">
                    <LocalizedText text="No courses created yet" />
                  </p>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/educator/course/create')}
                  >
                    <LocalizedText text="Create Your First Course" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-planner" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Course Planner" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Generate Course Outline" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Create Quiz Questions" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Improve Content" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="Course Analytics" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.courses && data.courses.length > 0 ? (
                <div className="space-y-3">
                  {data.courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{course.students} students</span>
                        <span>{course.rating}/5 rating</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    <LocalizedText text="No analytics data available" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <LocalizedText text="Publish courses to see student engagement" />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Student Management" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recentEnrollments && data.recentEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {data.recentEnrollments.map((enrollment, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{enrollment.studentName}</h4>
                      <p className="text-xs text-muted-foreground">{enrollment.courseName}</p>
                      <p className="text-xs text-muted-foreground">
                        Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    <LocalizedText text="No students enrolled yet" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <LocalizedText text="Students will appear here once they enroll" />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MobileAIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        context="You are an AI assistant helping educators create courses. Provide guidance on course creation, content development, and teaching strategies."
        placeholder="Ask me about course creation..."
      />
    </div>
  );
};
