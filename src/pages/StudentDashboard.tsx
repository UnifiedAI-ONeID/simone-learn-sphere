
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Brain, 
  Play, 
  Clock, 
  Star,
  Target,
  Zap,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [streakDays, setStreakDays] = useState(7);

  const currentCourses = [
    {
      id: 1,
      title: "AI-Powered Web Development",
      instructor: "Sarah Chen",
      progress: 68,
      nextLesson: "Building Neural Networks with React",
      timeLeft: "2h 30m",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Accessible Design Principles",
      instructor: "Marcus Johnson",
      progress: 34,
      nextLesson: "Screen Reader Optimization",
      timeLeft: "45m",
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Dr. Lisa Park",
      progress: 89,
      nextLesson: "Final Project Review",
      timeLeft: "1h 15m",
      difficulty: "Advanced"
    }
  ];

  const achievements = [
    { name: "First Course Completed", icon: Trophy, earned: true },
    { name: "7-Day Learning Streak", icon: Zap, earned: true },
    { name: "AI Study Assistant Power User", icon: Brain, earned: true },
    { name: "Community Helper", icon: Users, earned: false },
    { name: "Course Creator", icon: Target, earned: false }
  ];

  const aiSuggestions = [
    "Based on your progress in AI Development, try 'Machine Learning Basics'",
    "You're excelling in accessibility! Consider 'Advanced WCAG Guidelines'",
    "Your learning style suits visual content - check out our video-heavy courses"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              {streakDays} day streak
            </Badge>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => toast.success('AI Study Assistant activated!')}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Active Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">24h</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {currentCourses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant="outline">{course.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          by {course.instructor} • Next: {course.nextLesson}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span>{course.progress}% complete</span>
                            <span>{course.timeLeft} remaining</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => toast.success(`Continuing ${course.title}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Study Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized suggestions based on your learning patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Manage your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed course management coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community">
            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
                <CardDescription>Connect with fellow learners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Community features coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Track your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg ${
                        achievement.earned 
                          ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' 
                          : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <achievement.icon className={`h-8 w-8 ${
                          achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <h3 className={`font-medium ${
                            achievement.earned ? 'text-yellow-900 dark:text-yellow-100' : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {achievement.name}
                          </h3>
                          {achievement.earned && (
                            <Badge variant="secondary" className="mt-1 bg-yellow-200 text-yellow-800">
                              <Award className="w-3 h-3 mr-1" />
                              Earned
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
