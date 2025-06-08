
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Trophy, MessageSquare, Zap, Plus, Target, Calendar } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useStudentDashboardData } from '@/hooks/useDashboardData';
import { LocalizedText } from '@/components/LocalizedText';
import { MobileAIChat } from '@/components/mobile/MobileAIChat';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const MobileStudentDashboard = () => {
  const navigate = useNavigate();
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIChat, setShowAIChat] = useState(false);
  const { data, loading, error } = useStudentDashboardData();
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_student_dashboard');
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
          <TabsTrigger value="ai-tutor" className="text-xs">
            <LocalizedText text="AI Tutor" />
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            <LocalizedText text="Progress" />
          </TabsTrigger>
          <TabsTrigger value="badges" className="text-xs">
            <LocalizedText text="Badges" />
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
                      <LocalizedText text="Enrolled Courses" />
                    </p>
                    <p className="text-lg font-semibold">{data?.enrolledCourses || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Current Streak" />
                    </p>
                    <p className="text-lg font-semibold">{data?.currentStreak || 0} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Lessons Completed" />
                    </p>
                    <p className="text-lg font-semibold">{data?.completedLessons || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Points" />
                    </p>
                    <p className="text-lg font-semibold">{data?.totalPoints || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/courses')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                <LocalizedText text="Browse Courses" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Ask AI Tutor" />
              </Button>
            </CardContent>
          </Card>

          {data?.recentCourses && data.recentCourses.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  <LocalizedText text="Continue Learning" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.recentCourses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {course.progress}% complete
                      </span>
                      <Button size="sm" onClick={() => navigate(`/course/${course.id}`)}>
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              <LocalizedText text="My Courses" />
            </h2>
            <Button 
              size="sm" 
              onClick={() => navigate('/courses')}
            >
              <Plus className="h-3 w-3 mr-1" />
              <LocalizedText text="Browse" />
            </Button>
          </div>

          {data?.recentCourses && data.recentCourses.length > 0 ? (
            <div className="space-y-3">
              {data.recentCourses.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{course.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{course.progress}% complete</span>
                      <Button size="sm" onClick={() => navigate(`/course/${course.id}`)}>
                        Continue
                      </Button>
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
                    <LocalizedText text="No courses enrolled yet" />
                  </p>
                  <Button onClick={() => navigate('/courses')}>
                    <LocalizedText text="Browse Courses" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ai-tutor" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Learning Assistant" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                onClick={() => setShowAIChat(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Ask a Question" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => setShowAIChat(true)}
              >
                <Target className="h-4 w-4 mr-2" />
                <LocalizedText text="Get Study Tips" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Target className="h-4 w-4 mr-2" />
                <LocalizedText text="Learning Progress" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{data?.completedLessons || 0}</div>
                <p className="text-sm text-muted-foreground">
                  <LocalizedText text="Lessons Completed" />
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{data?.currentStreak || 0}</div>
                <p className="text-sm text-muted-foreground">
                  <LocalizedText text="Day Learning Streak" />
                </p>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{data?.totalPoints || 0}</div>
                <p className="text-sm text-muted-foreground">
                  <LocalizedText text="Total Points Earned" />
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                <LocalizedText text="Achievements" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.badges && data.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {data.badges.map((badge) => (
                    <div key={badge.id} className="text-center p-3 border rounded-lg">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <h4 className="font-medium text-sm">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    <LocalizedText text="No badges earned yet" />
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <LocalizedText text="Complete lessons to earn your first badge!" />
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
        context="You are an AI tutor helping students learn. Provide clear explanations, study tips, and answer questions about various subjects."
        placeholder="Ask me anything about your studies..."
      />
    </div>
  );
};
