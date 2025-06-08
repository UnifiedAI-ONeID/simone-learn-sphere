
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Database,
  DollarSign,
  TrendingUp,
  Bot,
  MessageSquare,
  Eye,
  UserPlus,
  Lock,
  BarChart3
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useAdminDashboardData } from '@/hooks/useDashboardData';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useAdminDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Mock critical alerts - in real app this would come from monitoring
  const criticalAlerts = data?.recentActivities?.filter(activity => 
    activity.type.includes('security') || activity.type.includes('error')
  ).slice(0, 2) || [];

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <LocalizedText text="Critical Alerts" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-red-900/20 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">{alert.message}</p>
                  <p className="text-xs text-red-600 dark:text-red-500">{alert.time}</p>
                </div>
                <Badge variant="destructive">high</Badge>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/admin/alerts')}
            >
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Users" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text={`${Math.round(((data?.activeUsers || 0) / (data?.totalUsers || 1)) * 100)}% active`} />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Active Sessions" />
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Current active users" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/revenue')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Courses" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Published courses" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/security')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Security Score" />
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94%</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text={`${data?.recentActivities?.length || 0} recent events`} />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Database className="h-5 w-5" />
              <LocalizedText text="System Health" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Real-time platform monitoring" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.systemMetrics?.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <Badge variant={metric.status === 'healthy' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}>
                    {metric.status}
                  </Badge>
                </div>
                <Progress value={metric.value} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.value}%</p>
              </div>
            )) || (
              <div className="text-center text-muted-foreground py-4">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No system metrics available</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/admin/system-health')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Metrics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Admin Activity */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5" />
              <LocalizedText text="Recent Activity" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Latest admin and system actions" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.user} • {new Date(activity.time).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/admin/audit-log')}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Full Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/users')}>
          <CardContent className="p-6 text-center">
            <UserPlus className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold mb-1">
              <LocalizedText text="Manage Users" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <LocalizedText text="View, edit, and manage user accounts" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/impersonation')}>
          <CardContent className="p-6 text-center">
            <Lock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <h3 className="font-semibold mb-1">
              <LocalizedText text="User Impersonation" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <LocalizedText text="Safely impersonate users for support" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/ai-monitoring')}>
          <CardContent className="p-6 text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold mb-1">
              <LocalizedText text="AI Monitoring" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <LocalizedText text="Monitor AI usage and abuse" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/admin/settings')}>
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <h3 className="font-semibold mb-1">
              <LocalizedText text="Platform Settings" />
            </h3>
            <p className="text-sm text-muted-foreground">
              <LocalizedText text="Configure global platform settings" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics Summary */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5" />
            <LocalizedText text="Platform Analytics Summary" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Key performance indicators" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {data?.totalUsers ? Math.round((data.activeUsers / data.totalUsers) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="User Retention Rate" />
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{data?.totalCourses || 0}</div>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="Total Courses" />
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {data?.usersByRole ? Math.round((data.usersByRole.educators / data.totalUsers) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="Educator Ratio" />
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button onClick={() => navigate('/admin/analytics')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              <LocalizedText text="View Detailed Analytics" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
