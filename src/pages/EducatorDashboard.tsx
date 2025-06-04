
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Brain, 
  Plus, 
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  BarChart
} from 'lucide-react';
import toast from 'react-hot-toast';

const EducatorDashboard = () => {
  const [courses] = useState([
    {
      id: 1,
      title: "AI-Powered Web Development",
      students: 127,
      revenue: 2540,
      rating: 4.8,
      status: "active",
      progress: "In Progress"
    },
    {
      id: 2,
      title: "Accessible Design Masterclass",
      students: 89,
      revenue: 1780,
      rating: 4.9,
      status: "active",
      progress: "Complete"
    },
    {
      id: 3,
      title: "React for Beginners",
      students: 234,
      revenue: 4680,
      rating: 4.7,
      status: "active",
      progress: "In Progress"
    }
  ]);

  const stats = {
    totalStudents: 450,
    totalRevenue: 8960,
    avgRating: 4.8,
    coursesPublished: 3
  };

  const recentActivity = [
    { type: 'enrollment', message: 'Sarah J. enrolled in AI-Powered Web Development', time: '2h ago' },
    { type: 'review', message: 'New 5-star review on Accessible Design Masterclass', time: '4h ago' },
    { type: 'question', message: 'Question posted in React for Beginners forum', time: '6h ago' },
    { type: 'completion', message: 'Mark T. completed Accessible Design Masterclass', time: '8h ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Educator Dashboard 📚
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your courses and track your impact
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => toast.success('AI Course Builder opening soon!')}
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Course Builder
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => toast.success('Course creation wizard started!')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalStudents}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">${stats.totalRevenue}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.avgRating}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{stats.coursesPublished}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Published Courses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Your most popular courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.students} students
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {course.rating}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${course.revenue}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.success(`Viewing analytics for ${course.title}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => toast.success(`Editing ${course.title}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'question' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                        {activity.type === 'review' && <Star className="w-4 h-4" />}
                        {activity.type === 'question' && <MessageSquare className="w-4 h-4" />}
                        {activity.type === 'completion' && <BookOpen className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Manage Courses</CardTitle>
                <CardDescription>Create, edit, and manage your course content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Course Management</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Detailed course creation and management tools coming soon!
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => toast.success('AI Course Builder starting...')}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Try AI Course Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>Track your course performance and student engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Comprehensive analytics dashboard coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Connect with and support your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Student Community</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Student interaction tools coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings & Payouts</CardTitle>
                <CardDescription>Track your revenue and manage payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Revenue Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Detailed earnings analytics coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducatorDashboard;
