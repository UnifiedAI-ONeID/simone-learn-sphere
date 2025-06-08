
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Server, 
  Activity, 
  Shield, 
  BarChart3, 
  Settings, 
  Download, 
  Brain, 
  Flag, 
  RefreshCw, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useAdminDashboardData } from '@/hooks/useDashboardData';

export const AdminDashboardContent = () => {
  const { data: adminData, loading, error, refetch } = useAdminDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load admin data. Please try again.
          <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!adminData) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Users className="h-16 w-16 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">
              Welcome to Admin Dashboard
            </CardTitle>
            <CardDescription className="text-lg">
              Start managing your platform by adding users and courses
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your platform is ready to go! Invite educators and students to get started.
            </p>
            <div className="flex justify-center space-x-4">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Invite Users
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Platform Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Status Alert */}
      <Alert>
        <Server className="h-4 w-4" />
        <AlertDescription>
          All systems operational. Platform is running smoothly.
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Active users</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Courses
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalCourses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Published courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${adminData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>
            User Distribution by Role
          </CardTitle>
          <CardDescription>
            Breakdown of users by their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Students
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{adminData.usersByRole.students}</span>
                <Progress 
                  value={(adminData.usersByRole.students / adminData.totalUsers) * 100} 
                  className="w-24" 
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Educators
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{adminData.usersByRole.educators}</span>
                <Progress 
                  value={(adminData.usersByRole.educators / adminData.totalUsers) * 100} 
                  className="w-24" 
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Admins
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{adminData.usersByRole.admins}</span>
                <Progress 
                  value={(adminData.usersByRole.admins / adminData.totalUsers) * 100} 
                  className="w-24" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Platform Activity
          </CardTitle>
          <CardDescription>
            Latest events and system updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminData.recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No recent activity to display. Activity will appear here as users interact with the platform.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
                    <span className="text-sm">
                      {activity.message}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>
            System Health
          </CardTitle>
          <CardDescription>
            Real-time system performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adminData.systemMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'healthy' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{metric.value}%</span>
                  <Progress value={metric.value} className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
