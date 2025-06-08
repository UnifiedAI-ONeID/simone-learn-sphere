
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Target, Brain, Play, Users, Star, Calendar, MessageSquare, Award, TrendingUp, Video, FileText, CheckCircle, BarChart3 } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';
import { MobileAIChat } from '@/components/mobile/MobileAIChat';

export const MobileStudentDashboard = () => {
  const navigate = useNavigate();
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIChat, setShowAIChat] = useState(false);
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_student_dashboard');
  }, [trackPageView]);

  // Real data would come from API calls
  const learningStats = {
    activeCourses: 0,
    achievements: 0,
    studyGoal: 0,
    totalHours: '0h',
    coursesCompleted: 0,
    currentStreak: 0,
    averageScore: 0,
    certificates: 0
  };

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
          <TabsTrigger value="community" className="text-xs">
            <LocalizedText text="Community" />
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
                      <LocalizedText text="Active Courses" />
                    </p>
                    <p className="text-lg font-semibold">{learningStats.activeCourses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Achievements" />
                    </p>
                    <p className="text-lg font-semibold">{learningStats.achievements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Target className="h-4 w-4 mr-2" />
                <LocalizedText text="Weekly Study Goal" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Progress</span>
                <span className="text-sm font-medium">{learningStats.studyGoal}% of 10 hours</span>
              </div>
              <Progress value={learningStats.studyGoal} className="h-2" />
              <p className="text-xs text-gray-500">
                <LocalizedText text="Start learning to track your progress!" />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <LocalizedText text="Continue Learning" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-3">
                  <LocalizedText text="No courses enrolled yet" />
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/student/courses')}
                >
                  <LocalizedText text="Browse Courses" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="My Courses" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-3">
                  <LocalizedText text="No courses enrolled yet" />
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/student/courses')}
                >
                  <LocalizedText text="Browse Available Courses" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-tutor" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Study Assistant" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setShowAIChat(true)}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Ask AI Tutor" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/ai-tutor')}
              >
                <Target className="h-4 w-4 mr-2" />
                <LocalizedText text="Get Study Plan" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/ai-tutor')}
              >
                <Star className="h-4 w-4 mr-2" />
                <LocalizedText text="Practice Quiz" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-gray-500">Total Hours</p>
                <p className="text-lg font-semibold">{learningStats.totalHours}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-semibold">{learningStats.coursesCompleted}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Achievements" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  <LocalizedText text="Complete lessons to earn achievements!" />
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Community Features" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/forums')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Discussion Forums" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/study-groups')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Study Groups" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/leaderboard')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <LocalizedText text="Leaderboards" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MobileAIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        context="You are an AI tutor helping a student. Provide educational guidance and support."
        placeholder="Ask me anything about your studies..."
      />
    </div>
  );
};
