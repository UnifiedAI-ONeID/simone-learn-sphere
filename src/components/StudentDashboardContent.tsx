
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  Target,
  Trophy,
  Clock,
  Star,
  CheckCircle,
  MessageCircle,
  Calendar,
  Zap,
  Brain,
  Award,
  Timer,
  BookMarked,
  Activity
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudentDashboardContent = () => {
  const myLearningData = [
    { id: 1, title: 'React Fundamentals', progress: 75, totalLessons: 24, completedLessons: 18, nextDeadline: '2 days', status: 'active' },
    { id: 2, title: 'JavaScript ES6+', progress: 45, totalLessons: 18, completedLessons: 8, nextDeadline: '5 days', status: 'active' },
    { id: 3, title: 'CSS Grid & Flexbox', progress: 90, totalLessons: 12, completedLessons: 11, nextDeadline: 'Completed', status: 'completed' },
    { id: 4, title: 'Node.js Basics', progress: 20, totalLessons: 16, completedLessons: 3, nextDeadline: '1 week', status: 'active' }
  ];

  const upcomingDeadlines = [
    { title: 'React State Management Quiz', course: 'React Fundamentals', dueDate: 'Tomorrow', type: 'quiz' },
    { title: 'Portfolio Project Submission', course: 'JavaScript ES6+', dueDate: 'Friday', type: 'project' },
    { title: 'CSS Animation Challenge', course: 'CSS Grid & Flexbox', dueDate: 'Next Monday', type: 'assignment' }
  ];

  const achievements = [
    { name: 'First Course Completed', description: 'Complete your first course', earned: true, icon: '🎓', date: '2 days ago' },
    { name: '7-Day Streak', description: 'Learn for 7 consecutive days', earned: true, icon: '🔥', date: 'Today' },
    { name: 'Quiz Master', description: 'Score 90%+ on 5 quizzes', earned: true, icon: '🧠', date: '1 week ago' },
    { name: 'Community Helper', description: 'Help 10 fellow students', earned: false, icon: '🤝', progress: 60 },
    { name: 'Speed Learner', description: 'Complete 3 lessons in one day', earned: false, icon: '⚡', progress: 33 }
  ];

  const studyGroups = [
    { name: 'React Study Group', members: 12, lastActivity: '30 min ago', topic: 'Hooks Deep Dive' },
    { name: 'JavaScript Beginners', members: 8, lastActivity: '2 hours ago', topic: 'Async/Await Help' },
    { name: 'CSS Masters', members: 15, lastActivity: '1 day ago', topic: 'Grid vs Flexbox' }
  ];

  const personalStats = {
    totalXP: 1250,
    currentStreak: 7,
    level: 5,
    totalLessonsCompleted: 40,
    averageQuizScore: 87,
    timeSpentLearning: '45 hours'
  };

  return (
    <div className="space-y-6">
      {/* Personal Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total XP" />
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{personalStats.totalXP}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text={`Level ${personalStats.level}`} />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Study Streak" />
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{personalStats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Keep it going!" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Lessons Completed" />
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{personalStats.totalLessonsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Total lessons" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Avg Quiz Score" />
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{personalStats.averageQuizScore}%</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Excellent work!" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5" />
                <LocalizedText text="My Courses" />
              </CardTitle>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myLearningData.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg bg-background">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <Badge variant={course.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                      {course.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent">
                    {course.status === 'completed' ? 'Review' : 'Continue'}
                  </Button>
                </div>
                
                <Progress value={course.progress} className="mb-3" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.nextDeadline}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5" />
              <LocalizedText text="Upcoming Deadlines" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Stay on track with your assignments" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline, index) => (
              <div key={index} className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">{deadline.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      {deadline.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{deadline.dueDate}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <Activity className="h-4 w-4 mr-2" />
              View All Deadlines
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges & Achievements */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Award className="h-5 w-5" />
              <LocalizedText text="Badges & Achievements" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Track your learning milestones" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.slice(0, 4).map((achievement, index) => (
              <div key={index} className={`p-3 rounded-lg border border-border ${achievement.earned ? 'bg-primary/10' : 'bg-background'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-medium text-foreground">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-primary">Earned {achievement.date}</p>
                      )}
                    </div>
                  </div>
                  {achievement.earned ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">{achievement.progress}%</div>
                      <Progress value={achievement.progress} className="w-16 h-2" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <Trophy className="h-4 w-4 mr-2" />
              View All Achievements
            </Button>
          </CardContent>
        </Card>

        {/* AI Tutor & Study Groups */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              <LocalizedText text="Community & Support" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Get help and connect with peers" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* AI Tutor Quick Access */}
            <div className="p-4 border border-border rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">AI Tutor</h4>
                    <p className="text-sm text-muted-foreground">Get instant help</p>
                  </div>
                </div>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Zap className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </div>
            </div>

            {/* Study Groups */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Active Study Groups</h4>
              {studyGroups.slice(0, 2).map((group, index) => (
                <div key={index} className="p-3 border border-border rounded-lg bg-background">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-foreground">{group.name}</h5>
                      <p className="text-sm text-muted-foreground">{group.topic}</p>
                      <p className="text-xs text-muted-foreground">{group.members} members • {group.lastActivity}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-accent">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Forums
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <Users className="h-4 w-4 mr-2" />
                Find Study Buddy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
