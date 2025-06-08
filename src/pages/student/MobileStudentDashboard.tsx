
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Target, Brain, Play, Users, Star } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileStudentDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_student_dashboard');
  }, [trackPageView]);

  const recentCourses = [
    { id: 1, title: 'React Fundamentals', progress: 75, nextLesson: 'Props & State', timeLeft: '2h 30m' },
    { id: 2, title: 'JavaScript Mastery', progress: 45, nextLesson: 'Async/Await', timeLeft: '4h 15m' },
    { id: 3, title: 'UI/UX Design', progress: 20, nextLesson: 'Color Theory', timeLeft: '6h 45m' },
  ];

  const achievements = [
    { id: 1, title: 'First Course', icon: '🎯', earned: true },
    { id: 2, title: 'Week Streak', icon: '🔥', earned: true },
    { id: 3, title: 'Quick Learner', icon: '⚡', earned: false },
    { id: 4, title: 'Community Helper', icon: '🤝', earned: true },
  ];

  const aiRecommendations = [
    { title: 'Advanced React Patterns', reason: 'Based on your React progress', difficulty: 'Intermediate' },
    { title: 'TypeScript Basics', reason: 'Complements your JavaScript skills', difficulty: 'Beginner' },
  ];

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
          <TabsTrigger value="ai-tutor" className="text-xs">
            <LocalizedText text="AI Tutor" />
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">
            <LocalizedText text="Progress" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Active Courses" />
                    </p>
                    <p className="text-lg font-semibold">3</p>
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
                      <LocalizedText text="Badges" />
                    </p>
                    <p className="text-lg font-semibold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Learning */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Play className="h-4 w-4 mr-2" />
                <LocalizedText text="Continue Learning" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentCourses.slice(0, 2).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{course.title}</p>
                    <p className="text-xs text-gray-500">Next: {course.nextLesson}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={course.progress} className="h-1 flex-1" />
                      <span className="text-xs text-gray-500">{course.progress}%</span>
                    </div>
                  </div>
                  <Button size="sm" className="ml-3">
                    <LocalizedText text="Resume" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Recommendations" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-sm">{rec.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{rec.reason}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{rec.difficulty}</Badge>
                    <Button size="sm" variant="outline">
                      <LocalizedText text="Explore" />
                    </Button>
                  </div>
                </div>
              ))}
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
            <CardContent className="space-y-3">
              {recentCourses.map((course) => (
                <div key={course.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{course.title}</p>
                    <Badge variant="outline">{course.progress}%</Badge>
                  </div>
                  <Progress value={course.progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Next: {course.nextLesson}</span>
                    <span>{course.timeLeft} left</span>
                  </div>
                </div>
              ))}
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
              <Button className="w-full justify-start" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="Ask AI Tutor" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                <LocalizedText text="Get Study Plan" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                <LocalizedText text="Practice Quiz" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Achievements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Achievements" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-3 rounded-lg border text-center ${
                    achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <p className={`text-xs font-medium ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                    }`}>{achievement.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Study Statistics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">This Week</span>
                <span className="font-semibold">12h 30m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Streak</span>
                <span className="font-semibold">7 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed Lessons</span>
                <span className="font-semibold">24</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
