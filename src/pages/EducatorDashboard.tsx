
import { DashboardHeader } from '@/components/DashboardHeader';
import { ImpersonationBanner } from '@/components/ImpersonationBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Edit, Eye } from 'lucide-react';

const EducatorDashboard = () => {
  // Mock data for demonstration
  const mockCourses = [
    {
      id: 1,
      title: "React for Beginners",
      students: 156,
      revenue: 4680,
      status: "published",
      rating: 4.8,
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      title: "Advanced TypeScript",
      students: 89,
      revenue: 2670,
      status: "published",
      rating: 4.9,
      lastUpdated: "2024-01-10"
    },
    {
      id: 3,
      title: "Node.js Masterclass",
      students: 0,
      revenue: 0,
      status: "draft",
      rating: 0,
      lastUpdated: "2024-01-20"
    }
  ];

  const stats = [
    {
      title: "Total Students",
      value: "245",
      icon: Users,
      description: "Across all courses"
    },
    {
      title: "Monthly Revenue",
      value: "$7,350",
      icon: DollarSign,
      description: "+12% from last month"
    },
    {
      title: "Published Courses",
      value: "2",
      icon: BookOpen,
      description: "1 in draft"
    },
    {
      title: "Average Rating",
      value: "4.85",
      icon: TrendingUp,
      description: "From student reviews"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ImpersonationBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <DashboardHeader 
            title="Educator Dashboard"
            subtitle="Manage your courses and track your success"
          />
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>
              Manage and track your course performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        <span className="font-medium">{course.students}</span> students
                      </div>
                      <div>
                        <span className="font-medium">${course.revenue}</span> revenue
                      </div>
                      {course.rating > 0 && (
                        <div>
                          <span className="font-medium">{course.rating}</span> ⭐ rating
                        </div>
                      )}
                      <div>
                        Updated: {new Date(course.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EducatorDashboard;
