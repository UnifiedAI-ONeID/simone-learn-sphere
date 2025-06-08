
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Trophy, Target, Brain, Play, Users, Star, Calendar, MessageSquare, Award, TrendingUp, Video, FileText, CheckCircle, BarChart3 } from 'lucide-react';
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
    { id: 1, title: 'React Fundamentals', progress: 75, nextLesson: 'Props & State', timeLeft: '2h 30m', instructor: 'John Doe', rating: 4.8 },
    { id: 2, title: 'JavaScript Mastery', progress: 45, nextLesson: 'Async/Await', timeLeft: '4h 15m', instructor: 'Jane Smith', rating: 4.9 },
    { id: 3, title: 'UI/UX Design', progress: 20, nextLesson: 'Color Theory', timeLeft: '6h 45m', instructor: 'Mike Johnson', rating: 4.7 },
  ];

  const achievements = [
    { id: 1, title: 'First Course', icon: '🎯', earned: true, description: 'Completed your first course' },
    { id: 2, title: 'Week Streak', icon: '🔥', earned: true, description: '7 days of continuous learning' },
    { id: 3, title: 'Quick Learner', icon: '⚡', earned: false, description: 'Complete 3 lessons in one day' },
    { id: 4, title: 'Community Helper', icon: '🤝', earned: true, description: 'Helped 5 fellow students' },
    { id: 5, title: 'Quiz Master', icon: '🧠', earned: true, description: 'Scored 100% on 10 quizzes' },
    { id: 6, title: 'Early Bird', icon: '🌅', earned: false, description: 'Study before 8 AM for 5 days' },
  ];

  const aiRecommendations = [
    { title: 'Advanced React Patterns', reason: 'Based on your React progress', difficulty: 'Intermediate', estimatedTime: '8 hours' },
    { title: 'TypeScript Basics', reason: 'Complements your JavaScript skills', difficulty: 'Beginner', estimatedTime: '4 hours' },
    { title: 'Node.js Fundamentals', reason: 'Complete your full-stack journey', difficulty: 'Intermediate', estimatedTime: '12 hours' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Live Q&A: React Best Practices', date: 'Tomorrow 3:00 PM', type: 'webinar' },
    { id: 2, title: 'Assignment Due: JavaScript Project', date: 'Dec 15, 2024', type: 'assignment' },
    { id: 3, title: 'Study Group: UI/UX Discussion', date: 'Dec 12, 2024', type: 'study-group' },
  ];

  const learningStats = {
    totalHours: '47h 30m',
    coursesCompleted: 8,
    currentStreak: 12,
    averageScore: 89,
    certificates: 3,
    studyGoal: 75 // percentage of weekly goal
  };

  const discussionForums = [
    { id: 1, title: 'Help with React Hooks', replies: 12, lastActivity: '2 hours ago', category: 'React' },
    { id: 2, title: 'Best practices for CSS Grid', replies: 8, lastActivity: '4 hours ago', category: 'CSS' },
    { id: 3, title: 'JavaScript async patterns', replies: 15, lastActivity: '1 day ago', category: 'JavaScript' },
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
          {/* Learning Stats */}
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
                      <LocalizedText text="Achievements" />
                    </p>
                    <p className="text-lg font-semibold">{achievements.filter(a => a.earned).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Study Goal */}
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
                <LocalizedText text="You're doing great! Keep up the momentum." />
              </p>
            </CardContent>
          </Card>

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
                <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
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
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Next: {course.nextLesson}</span>
                    <span>{course.timeLeft} left</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Instructor: {course.instructor}</span>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      <LocalizedText text="Continue" />
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-3 w-3 mr-1" />
                      <LocalizedText text="Materials" />
                    </Button>
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
              <Button className="w-full justify-start" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                <LocalizedText text="Video Explanations" />
              </Button>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Personalized Recommendations" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-sm">{rec.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{rec.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="text-xs">{rec.difficulty}</Badge>
                      <Badge variant="outline" className="text-xs">{rec.estimatedTime}</Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      <LocalizedText text="Explore" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Learning Statistics */}
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
                    <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="Performance Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Streak</span>
                <span className="font-semibold">{learningStats.currentStreak} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Score</span>
                <span className="font-semibold">{learningStats.averageScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificates</span>
                <span className="font-semibold">{learningStats.certificates}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {/* Discussion Forums */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Discussion Forums" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discussionForums.map((forum) => (
                <div key={forum.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{forum.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{forum.replies} replies • {forum.lastActivity}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {forum.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Community Features" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Join Study Groups" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                <LocalizedText text="Ask Questions" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                <LocalizedText text="Peer Reviews" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                <LocalizedText text="Leaderboards" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
