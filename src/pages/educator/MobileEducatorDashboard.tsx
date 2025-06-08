
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, Plus, BarChart3, Brain, Settings, Eye, MessageSquare, DollarSign, TrendingUp, Calendar, Video, FileText, Award, Target, Clock } from 'lucide-react';
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
    { id: 1, title: 'React Fundamentals', students: 45, progress: 78, status: 'Published', revenue: '$1,200', rating: 4.8, completionRate: 85 },
    { id: 2, title: 'JavaScript Basics', students: 32, progress: 65, status: 'Published', revenue: '$890', rating: 4.6, completionRate: 78 },
    { id: 3, title: 'Advanced CSS', students: 28, progress: 90, status: 'Draft', revenue: '$0', rating: 0, completionRate: 0 },
    { id: 4, title: 'Node.js Backend', students: 67, progress: 95, status: 'Published', revenue: '$2,100', rating: 4.9, completionRate: 92 },
  ];

  const recentActivity = [
    { type: 'enrollment', message: '5 new students enrolled in React Fundamentals', time: '1h ago', icon: Users },
    { type: 'completion', message: '12 students completed Module 4 in JavaScript Basics', time: '3h ago', icon: Award },
    { type: 'question', message: '3 new questions in Node.js Q&A forum', time: '5h ago', icon: MessageSquare },
    { type: 'review', message: 'New 5-star review for React Fundamentals', time: '8h ago', icon: TrendingUp },
  ];

  const analytics = {
    totalRevenue: '$4,190',
    monthlyGrowth: '+23%',
    studentSatisfaction: '4.7/5',
    completionRate: '85%',
    totalStudents: 172,
    activeStudents: 89,
    courseViews: 1247,
    forumEngagement: '78%'
  };

  const upcomingEvents = [
    { id: 1, title: 'Live Webinar: React Best Practices', date: 'Dec 15, 2024 3:00 PM', attendees: 45 },
    { id: 2, title: 'Office Hours: JavaScript Q&A', date: 'Dec 16, 2024 2:00 PM', attendees: 23 },
    { id: 3, title: 'Course Review Session', date: 'Dec 18, 2024 4:00 PM', attendees: 12 },
  ];

  const studentFeedback = [
    { id: 1, course: 'React Fundamentals', student: 'John D.', rating: 5, comment: 'Excellent course structure!', time: '2 days ago' },
    { id: 2, course: 'JavaScript Basics', student: 'Sarah M.', rating: 4, comment: 'Very helpful examples', time: '3 days ago' },
    { id: 3, course: 'Node.js Backend', student: 'Mike R.', rating: 5, comment: 'Best backend course ever!', time: '1 week ago' },
  ];

  const courseDrafts = [
    { id: 1, title: 'TypeScript Masterclass', progress: 60, lastEdited: '2 hours ago' },
    { id: 2, title: 'Vue.js Fundamentals', progress: 25, lastEdited: '1 day ago' },
    { id: 3, title: 'GraphQL APIs', progress: 80, lastEdited: '3 days ago' },
  ];

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
          <TabsTrigger value="analytics" className="text-xs">
            <LocalizedText text="Analytics" />
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs">
            <LocalizedText text="Students" />
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
                    <p className="text-lg font-semibold">{courses.filter(c => c.status === 'Published').length}</p>
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
                      <LocalizedText text="Total Students" />
                    </p>
                    <p className="text-lg font-semibold">{analytics.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <LocalizedText text="Revenue Overview" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold text-lg">{analytics.totalRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monthly Growth</span>
                <Badge variant="default" className="bg-green-100 text-green-700">{analytics.monthlyGrowth}</Badge>
              </div>
            </CardContent>
          </Card>

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
                <Video className="h-4 w-4 mr-2" />
                <LocalizedText text="Schedule Webinar" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Check Q&A Forums" />
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
              {recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <activity.icon className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <LocalizedText text="Upcoming Events" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                  <p className="text-xs text-blue-600 mt-1">{event.attendees} attendees</p>
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
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Students</p>
                    <p className="font-semibold">{course.students}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-semibold">{course.revenue}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-semibold">{course.rating || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  {course.status === 'Published' && (
                    <>
                      <div className="flex items-center justify-between text-xs">
                        <span>Completion Rate</span>
                        <span>{course.completionRate}%</span>
                      </div>
                      <Progress value={course.completionRate} className="h-1" />
                    </>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    <LocalizedText text="View" />
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    <LocalizedText text="Edit" />
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    <LocalizedText text="Stats" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Course Drafts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Course Drafts" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseDrafts.map((draft) => (
                <div key={draft.id} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{draft.title}</p>
                    <Badge variant="outline" className="text-xs">{draft.progress}%</Badge>
                  </div>
                  <Progress value={draft.progress} className="h-1 mb-2" />
                  <p className="text-xs text-gray-500">Last edited: {draft.lastEdited}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-lg font-semibold">{analytics.totalRevenue}</p>
                <p className="text-xs text-green-500">{analytics.monthlyGrowth}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-gray-500">Satisfaction</p>
                <p className="text-lg font-semibold">{analytics.studentSatisfaction}</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Performance Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Students</span>
                <span className="font-semibold">{analytics.activeStudents}/{analytics.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Course Views</span>
                <span className="font-semibold">{analytics.courseViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Forum Engagement</span>
                <span className="font-semibold">{analytics.forumEngagement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completion Rate</span>
                <span className="font-semibold">{analytics.completionRate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Course Performance */}
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
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Completion: {course.completionRate}%</span>
                      <span>Rating: {course.rating}/5</span>
                    </div>
                    <Progress value={course.completionRate} className="h-2" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Revenue: {course.revenue}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Student Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Users className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-lg font-semibold">{analytics.totalStudents}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <Target className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-xs text-gray-500">Active Now</p>
                <p className="text-lg font-semibold">{analytics.activeStudents}</p>
              </CardContent>
            </Card>
          </div>

          {/* Student Feedback */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Recent Feedback" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {studentFeedback.map((feedback) => (
                <div key={feedback.id} className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{feedback.student}</p>
                      <p className="text-xs text-gray-500">{feedback.course}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < feedback.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm italic">"{feedback.comment}"</p>
                  <p className="text-xs text-gray-500 mt-1">{feedback.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Student Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="View All Students" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Send Announcements" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                <LocalizedText text="Issue Certificates" />
              </Button>
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
                <Video className="h-4 w-4 mr-2" />
                <LocalizedText text="Video Script Generator" />
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
                <LocalizedText text="AI Insights & Recommendations" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm">Course Improvement Suggestion</p>
                <p className="text-xs text-gray-600 mt-1">
                  Students in React Fundamentals are struggling with hooks. Consider adding more interactive examples and practice exercises.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-sm">Trending Topic Alert</p>
                <p className="text-xs text-gray-600 mt-1">
                  TypeScript is trending among your students. Consider creating a course to capitalize on this demand.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-sm">Engagement Optimization</p>
                <p className="text-xs text-gray-600 mt-1">
                  Adding video content to JavaScript Basics could improve engagement by 15% based on similar courses.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Generation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Quick Content Generation" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                <LocalizedText text="Generate Assignment" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                <LocalizedText text="Create Study Schedule" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                <LocalizedText text="Design Certificates" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
