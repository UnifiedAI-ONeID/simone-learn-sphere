
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
  BarChart3,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  MessageCircle,
  Bot,
  Download,
  Eye,
  Edit,
  Send
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const EducatorDashboardContent = () => {
  const myCourses = [
    { 
      id: 1, 
      title: 'React Fundamentals', 
      status: 'published', 
      enrollments: 125, 
      avgQuizScore: 87, 
      dropOffRate: 12,
      revenue: 2450,
      lastUpdated: '2 days ago'
    },
    { 
      id: 2, 
      title: 'Advanced JavaScript', 
      status: 'draft', 
      enrollments: 0, 
      avgQuizScore: 0, 
      dropOffRate: 0,
      revenue: 0,
      lastUpdated: '1 week ago'
    },
    { 
      id: 3, 
      title: 'Node.js Basics', 
      status: 'published', 
      enrollments: 67, 
      avgQuizScore: 92, 
      dropOffRate: 8,
      revenue: 1340,
      lastUpdated: '5 days ago'
    }
  ];

  const totalRevenue = 3790;
  const pendingPayouts = 850;
  const thisMonthEarnings = 1200;

  const inactiveStudents = [
    { name: 'Alice Johnson', course: 'React Fundamentals', lastSeen: '5 days ago', progress: 45 },
    { name: 'Bob Smith', course: 'Node.js Basics', lastSeen: '3 days ago', progress: 72 },
    { name: 'Carol Davis', course: 'React Fundamentals', lastSeen: '1 week ago', progress: 23 }
  ];

  const recentSubmissions = [
    { student: 'David Wilson', assignment: 'Todo App Project', course: 'React Fundamentals', submitted: '2 hours ago', status: 'pending' },
    { student: 'Emma Brown', assignment: 'API Integration', course: 'Node.js Basics', submitted: '1 day ago', status: 'pending' },
    { student: 'Frank Miller', assignment: 'Component Library', course: 'React Fundamentals', submitted: '2 days ago', status: 'reviewed' }
  ];

  const aiSuggestions = [
    { type: 'content', suggestion: 'Add interactive coding exercises to React Hooks lesson', priority: 'high' },
    { type: 'quiz', suggestion: 'Create assessment for JavaScript closures topic', priority: 'medium' },
    { type: 'improvement', suggestion: 'Students struggle with async concepts - consider video explanation', priority: 'high' },
    { type: 'engagement', suggestion: 'Add discussion prompts to increase forum participation', priority: 'low' }
  ];

  const coursePerformance = {
    totalStudents: 192,
    activeStudents: 156,
    completionRate: 78,
    avgRating: 4.6
  };

  return (
    <div className="space-y-6">
      {/* Revenue Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="All time earnings" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="This Month" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${thisMonthEarnings}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="+15% from last month" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Pending Payouts" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Available next week" />
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
                New Course
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.map((course) => (
              <div key={course.id} className="p-4 border border-border rounded-lg bg-background">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{course.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                      {course.status === 'published' && (
                        <Badge variant="outline" className="text-xs">
                          {course.enrollments} students
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Updated {course.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {course.status === 'published' && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quiz Average</p>
                      <p className="font-semibold text-foreground">{course.avgQuizScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold text-foreground">${course.revenue}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Drop-off</p>
                      <p className="font-semibold text-foreground">{course.dropOffRate}%</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Course Performance Summary */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="h-5 w-5" />
              <LocalizedText text="Course Performance" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Overall metrics across all courses" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{coursePerformance.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{coursePerformance.activeStudents}</div>
                    <p className="text-xs text-muted-foreground">Active Students</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="text-foreground">{coursePerformance.completionRate}%</span>
                </div>
                <Progress value={coursePerformance.completionRate} />
              </div>
              
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-foreground">Average Rating</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{coursePerformance.avgRating}</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Suggestions Panel */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Bot className="h-5 w-5" />
              <LocalizedText text="AI Suggestions" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Improve your courses with AI-powered insights" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{suggestion.suggestion}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <FileText className="h-4 w-4 mr-2" />
                Generate Lesson
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement Panel */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              <LocalizedText text="Student Engagement" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Monitor and support student progress" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-orange-900 dark:text-orange-100">Inactive Learners</h4>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
              <div className="space-y-2">
                {inactiveStudents.slice(0, 2).map((student, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">{student.name}</p>
                      <p className="text-orange-700 dark:text-orange-300">{student.course} • {student.progress}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 dark:text-orange-400">{student.lastSeen}</p>
                      <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900">
                        <Send className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Engagement Heatmap
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions & Reviews */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5" />
            <LocalizedText text="Recent Submissions" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <LocalizedText text="Review student work and provide feedback" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {recentSubmissions.map((submission, index) => (
              <div key={index} className="p-3 border border-border rounded-lg bg-background">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{submission.assignment}</p>
                      <Badge variant={submission.status === 'pending' ? 'secondary' : 'default'} className="text-xs">
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      by {submission.student} • {submission.course}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{submission.submitted}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {submission.status === 'pending' ? 'Review' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Announcement
            </Button>
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
