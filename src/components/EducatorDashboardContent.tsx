
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
  Download
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
      revenue: 2450 
    },
    { 
      id: 2, 
      title: 'Advanced JavaScript', 
      status: 'draft', 
      enrollments: 0, 
      avgQuizScore: 0, 
      dropOffRate: 0,
      revenue: 0 
    },
    { 
      id: 3, 
      title: 'Node.js Basics', 
      status: 'published', 
      enrollments: 67, 
      avgQuizScore: 92, 
      dropOffRate: 8,
      revenue: 1340 
    }
  ];

  const totalRevenue = 3790;
  const pendingPayouts = 850;
  const thisMonthEarnings = 1200;

  const inactiveStudents = [
    { name: 'Alice Johnson', course: 'React Fundamentals', lastSeen: '5 days ago' },
    { name: 'Bob Smith', course: 'Node.js Basics', lastSeen: '3 days ago' }
  ];

  const recentSubmissions = [
    { student: 'Carol Davis', assignment: 'Todo App Project', course: 'React Fundamentals', submitted: '2 hours ago' },
    { student: 'David Wilson', assignment: 'API Integration', course: 'Node.js Basics', submitted: '1 day ago' }
  ];

  const aiSuggestions = [
    { type: 'content', suggestion: 'Add interactive coding exercises to React Hooks lesson' },
    { type: 'quiz', suggestion: 'Create assessment for JavaScript closures topic' },
    { type: 'improvement', suggestion: 'Students struggle with async concepts - consider video explanation' }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="All time earnings" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="This Month" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthEarnings}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="+15% from last month" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Pending Payouts" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Available next week" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <LocalizedText text="My Courses" />
              </CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="mt-1">
                      {course.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    {course.status === 'published' ? 'Manage' : 'Edit'}
                  </Button>
                </div>
                
                {course.status === 'published' && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Enrollments</p>
                      <p className="font-semibold">{course.enrollments}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Quiz Score</p>
                      <p className="font-semibold">{course.avgQuizScore}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Drop-off Rate</p>
                      <p className="font-semibold">{course.dropOffRate}%</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Suggestions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <LocalizedText text="AI Suggestions" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Improve your courses with AI-powered insights" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-xs">
                      {suggestion.type}
                    </Badge>
                    <p className="text-sm">{suggestion.suggestion}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Lesson
              </Button>
              <Button variant="outline" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Engagement Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <LocalizedText text="Student Engagement" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">Inactive Learners</h4>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
              <div className="space-y-2">
                {inactiveStudents.map((student, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-gray-600">{student.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600">{student.lastSeen}</p>
                      <Button size="sm" variant="outline">
                        Send Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Engagement Heatmap
            </Button>
          </CardContent>
        </Card>

        {/* Recent Submissions & Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <LocalizedText text="Recent Submissions" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{submission.assignment}</p>
                    <p className="text-xs text-gray-600">
                      by {submission.student} • {submission.course}
                    </p>
                    <p className="text-xs text-green-600 mt-1">{submission.submitted}</p>
                  </div>
                  <Button size="sm">
                    Review
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
