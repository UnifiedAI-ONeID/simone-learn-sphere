
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, BarChart3, Settings, DollarSign, Flag, Brain, Eye, AlertTriangle } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useAdminDashboardData } from '@/hooks/useDashboardData';
import { LocalizedText } from '@/components/LocalizedText';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const MobileAdminDashboard = () => {
  const navigate = useNavigate();
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error } = useAdminDashboardData();
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_admin_dashboard');
  }, [trackPageView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Error loading dashboard: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            <LocalizedText text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs">
            <LocalizedText text="Users" />
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <LocalizedText text="Security" />
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs">
            <LocalizedText text="System" />
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs">
            <LocalizedText text="Content" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Users" />
                    </p>
                    <p className="text-lg font-semibold">{data?.totalUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Active Users" />
                    </p>
                    <p className="text-lg font-semibold">{data?.activeUsers || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Courses" />
                    </p>
                    <p className="text-lg font-semibold">{data?.totalCourses || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Security Events" />
                    </p>
                    <p className="text-lg font-semibold">{data?.recentActivities?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="User Distribution" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Students</span>
                <span className="text-sm font-medium">{data?.usersByRole?.students || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Educators</span>
                <span className="text-sm font-medium">{data?.usersByRole?.educators || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Admins</span>
                <span className="text-sm font-medium">{data?.usersByRole?.admins || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Users" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="View Analytics" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Review Reports" />
              </Button>
            </CardContent>
          </Card>

          {data?.recentActivities && data.recentActivities.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  <LocalizedText text="Recent Activity" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.recentActivities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="text-sm border-l-2 border-blue-500 pl-3">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-muted-foreground text-xs">
                      {activity.user} • {new Date(activity.time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="User Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="View All Users" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/users?role=educator')}
              >
                <Eye className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Educators" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/users?role=student')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Students" />
              </Button>
            </CardContent>
          </Card>

          {data?.usersByRole && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  <LocalizedText text="User Statistics" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Users</span>
                  <span className="font-semibold">{data.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Users</span>
                  <span className="font-semibold">{data.activeUsers}</span>
                </div>
                <div className="text-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    {Math.round((data.activeUsers / data.totalUsers) * 100)}% active rate
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Center" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/ai-logs')}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Audit Trail" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Reports" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Settings" />
              </Button>
            </CardContent>
          </Card>

          {data?.systemMetrics && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  <LocalizedText text="System Health" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.systemMetrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{metric.value}%</span>
                      <span className={`w-2 h-2 rounded-full ${
                        metric.status === 'healthy' ? 'bg-green-500' : 
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="System Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Platform Settings" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="System Analytics" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/payouts')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                <LocalizedText text="Payment Management" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Content Moderation" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Review Reports" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="secondary"
                onClick={() => navigate('/admin/analytics')}
              >
                <Eye className="h-4 w-4 mr-2" />
                <LocalizedText text="Content Analytics" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
