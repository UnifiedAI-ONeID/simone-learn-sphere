
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  Star,
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  MessageCircle,
  Users,
  Zap,
  Bell,
  Award
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudentDashboardContent = () => {
  // Mock data - in real app, this would come from hooks
  const enrolledCourses = [
    { id: 1, title: 'React Fundamentals', progress: 75, nextLesson: 'Props & State', dueDate: '2025-01-15' },
    { id: 2, title: 'JavaScript Mastery', progress: 45, nextLesson: 'Async/Await', dueDate: '2025-01-18' }
  ];
  
  const dailyStreak = 7;
  const xpPoints = 2480;
  const xpToNextLevel = 520;
  
  const badges = [
    { name: 'Quick Learner', icon: '🚀', earned: true },
    { name: 'Code Master', icon: '💻', earned: true },
    { name: 'Consistency King', icon: '👑', earned: false, progress: 80 }
  ];

  const upcomingDeadlines = [
    { type: 'Quiz', title: 'React Components Quiz', course: 'React Fundamentals', due: '2025-01-15' },
    { type: 'Project', title: 'Todo App Project', course: 'JavaScript Mastery', due: '2025-01-18' }
  ];

  const announcements = [
    { title: 'New AI Tutor Features Released!', time: '2 hours ago', type: 'platform' },
    { title: 'React Cohort Study Session Tomorrow', time: '1 day ago', type: 'cohort' }
  ];

  const studyGroups = [
    { name: 'React Study Group', members: 12, lastActivity: '30 min ago' },
    { name: 'JavaScript Beginners', members: 8, lastActivity: '2 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Daily Streak & XP Bar */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{dailyStreak} Day Streak!</h3>
                <p className="text-white/80">Keep it up! You're on fire! 🔥</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{xpPoints} XP</p>
              <div className="flex items-center space-x-2 mt-2">
                <Progress value={(xpPoints / (xpPoints + xpToNextLevel)) * 100} className="w-32 h-2" />
                <span className="text-sm">{xpToNextLevel} to next level</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <LocalizedText text="My Courses" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                  </div>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse More Courses
            </Button>
          </CardContent>
        </Card>

        {/* AI Tutor Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <LocalizedText text="AI Tutor" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Get instant help with your lessons" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">💡 Quick Help</p>
              <p className="text-xs text-blue-600">Ask about React concepts, JavaScript syntax, or any lesson topic!</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Ask AI Tutor
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <LocalizedText text="Upcoming Deadlines" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{deadline.title}</p>
                  <p className="text-xs text-gray-600">{deadline.course}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {deadline.type}
                  </Badge>
                  <p className="text-xs text-orange-600">{deadline.due}</p>
                </div>
              </div>
            ))}
            
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges & Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <LocalizedText text="Badges & Achievements" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {badges.map((badge, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                badge.earned ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    {!badge.earned && badge.progress && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={badge.progress} className="w-16 h-1" />
                        <span className="text-xs text-gray-500">{badge.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                {badge.earned && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Award className="h-4 w-4 mr-2" />
              View All Achievements
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <LocalizedText text="Announcements" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <p className="font-medium text-sm">{announcement.title}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{announcement.time}</span>
                  <Badge variant="secondary" className="text-xs">
                    {announcement.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Study Groups & Forums */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <LocalizedText text="Study Groups" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {studyGroups.map((group, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{group.name}</p>
                  <p className="text-xs text-gray-600">{group.members} members</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{group.lastActivity}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Join
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Browse All Forums
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
