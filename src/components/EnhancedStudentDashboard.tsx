import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Trophy, Target, Clock, Zap, Lightbulb, TrendingUp, Star, CheckCircle } from 'lucide-react';
import { useChatGPT } from '@/hooks/useChatGPT';
import { useToast } from '@/hooks/use-toast';

export const EnhancedStudentDashboard = () => {
  const { toast } = useToast();
  const { sendMessage, isLoading } = useChatGPT();
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Mock student data
  const studentData = {
    coursesEnrolled: 4,
    coursesCompleted: 2,
    totalLessons: 45,
    completedLessons: 28,
    streakDays: 7,
    points: 1250,
    level: 5,
    activeCourses: [
      { name: 'React Fundamentals', progress: 75, nextLesson: 'State Management', timeLeft: '2h 30m' },
      { name: 'JavaScript ES6+', progress: 60, nextLesson: 'Async/Await', timeLeft: '1h 45m' },
      { name: 'CSS Grid & Flexbox', progress: 90, nextLesson: 'Responsive Design', timeLeft: '45m' },
      { name: 'Node.js Basics', progress: 30, nextLesson: 'Express Setup', timeLeft: '3h 15m' },
    ],
    achievements: [
      { name: 'First Course Completed', icon: '🎓', date: '2 days ago' },
      { name: '7-Day Streak', icon: '🔥', date: 'Today' },
      { name: 'Quiz Master', icon: '🧠', date: '1 week ago' },
    ],
    weakAreas: ['Asynchronous JavaScript', 'CSS Animations', 'Database Design'],
    strengths: ['HTML Structure', 'Basic JavaScript', 'React Components']
  };

  const generatePersonalizedStudyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const prompt = `Create a personalized study plan for a student with this profile:
      
      Progress: ${studentData.completedLessons}/${studentData.totalLessons} lessons completed
      Current Courses: ${studentData.activeCourses.map(c => `${c.name} (${c.progress}%)`).join(', ')}
      Weak Areas: ${studentData.weakAreas.join(', ')}
      Strengths: ${studentData.strengths.join(', ')}
      Study Streak: ${studentData.streakDays} days
      
      Provide 5-6 specific, actionable study recommendations for the next week to improve learning outcomes.`;

      // Mock study plan for now
      const mockPlan = [
        "Focus 30 minutes daily on Asynchronous JavaScript - complete 2 lessons this week",
        "Practice CSS Animations with hands-on projects - build 1 animation per day",
        "Review React State Management concepts before advancing to next lesson",
        "Complete Node.js Express Setup lesson by Wednesday to maintain momentum",
        "Take a practice quiz on Database Design fundamentals",
        "Dedicate Friday for reviewing and reinforcing your strengths in React Components"
      ];

      setStudyPlan(mockPlan);
      toast({
        title: "Personalized Study Plan Ready!",
        description: "Your AI-generated study plan is optimized for your learning style.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Learning Dashboard</h2>
          <p className="text-gray-600">Personalized insights to accelerate your learning</p>
        </div>
        <Button 
          onClick={generatePersonalizedStudyPlan}
          disabled={isGeneratingPlan}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          {isGeneratingPlan ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Creating Plan...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Study Plan
            </>
          )}
        </Button>
      </div>

      {/* Personalized Study Plan */}
      {studyPlan.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Your Personalized Study Plan
            </CardTitle>
            <CardDescription>
              AI-curated recommendations based on your learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studyPlan.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{item}</p>
                  <Button size="sm" variant="outline" className="text-xs">
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((studentData.completedLessons / studentData.totalLessons) * 100)}%
                </p>
                <Progress 
                  value={(studentData.completedLessons / studentData.totalLessons) * 100} 
                  className="mt-2 h-2" 
                />
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900">{studentData.streakDays} days</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  🔥 Keep it going!
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{studentData.points}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Level {studentData.level}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses Completed</p>
                <p className="text-2xl font-bold text-gray-900">{studentData.coursesCompleted}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {studentData.coursesEnrolled - studentData.coursesCompleted} in progress
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Learning Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-6">
            {studentData.activeCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                    </div>
                    <Badge variant={course.progress > 80 ? "default" : course.progress > 50 ? "secondary" : "outline"}>
                      {course.progress}%
                    </Badge>
                  </div>
                  <Progress value={course.progress} className="mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.timeLeft} remaining
                    </span>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Continue Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Your Strengths
                </CardTitle>
                <CardDescription>Areas where you excel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Target className="w-5 h-5 mr-2" />
                  Focus Areas
                </CardTitle>
                <CardDescription>Topics to prioritize in your studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lightbulb className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">{area}</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Study Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-tutor" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Brain className="w-12 h-12 text-purple-600 mx-auto" />
                  <h3 className="text-lg font-semibold">Concept Explainer</h3>
                  <p className="text-sm text-gray-600">Get AI explanations for complex topics</p>
                  <Button className="w-full">Ask Question</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Target className="w-12 h-12 text-blue-600 mx-auto" />
                  <h3 className="text-lg font-semibold">Practice Generator</h3>
                  <p className="text-sm text-gray-600">AI-generated exercises based on your progress</p>
                  <Button className="w-full">Generate Practice</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Lightbulb className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="text-lg font-semibold">Study Assistant</h3>
                  <p className="text-sm text-gray-600">Get help with homework and assignments</p>
                  <Button className="w-full">Get Help</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentData.achievements.map((achievement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="text-5xl">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">Earned {achievement.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
