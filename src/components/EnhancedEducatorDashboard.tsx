
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit3, Eye, BarChart3 } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const EnhancedEducatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, loading } = useCourses();

  // Filter courses created by this educator
  const myCourses = courses.filter(course => course.educator_id === user?.id);
  const publishedCourses = myCourses.filter(course => course.is_published);
  const draftCourses = myCourses.filter(course => !course.is_published);
  const totalEnrollments = myCourses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0);

  // Mock data for analytics
  const revenueData = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1800 },
    { month: 'Mar', revenue: 2400 },
    { month: 'Apr', revenue: 3200 },
    { month: 'May', revenue: 4100 },
    { month: 'Jun', revenue: 4800 },
  ];

  const enrollmentData = [
    { month: 'Jan', enrollments: 45 },
    { month: 'Feb', enrollments: 78 },
    { month: 'Mar', enrollments: 92 },
    { month: 'Apr', enrollments: 124 },
    { month: 'May', enrollments: 156 },
    { month: 'Jun', enrollments: 189 },
  ];

  const coursePerformance = [
    { name: 'Technology', value: 40, color: '#3b82f6' },
    { name: 'Business', value: 30, color: '#10b981' },
    { name: 'Design', value: 20, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#ef4444' },
  ];

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Educator Dashboard 👨‍🏫</h1>
            <p className="text-purple-100 text-lg">Manage your courses and track your teaching impact</p>
          </div>
          <Button className="bg-white text-purple-600 hover:bg-gray-100">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-blue-700">{myCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold text-green-700">{totalEnrollments}</p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Monthly Revenue</p>
                <p className="text-3xl font-bold text-yellow-700">$4,800</p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Avg. Rating</p>
                <p className="text-3xl font-bold text-purple-700">4.8</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Student Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Course Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={coursePerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {coursePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {coursePerformance.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                  <span className="text-gray-800 font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                My Courses
              </span>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.length > 0 ? (
              myCourses.slice(0, 4).map(course => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail_url || '/placeholder.svg'}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-600">
                        {course.enrollment_count || 0} students • {course.estimated_duration}h
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{course.difficulty_level}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No courses created yet. Start by creating your first course!</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
