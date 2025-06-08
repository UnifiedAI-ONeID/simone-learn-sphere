
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Shield, Activity, AlertTriangle, Settings, Database, BarChart3, UserCheck, Lock } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileAdminDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_admin_dashboard');
  }, [trackPageView]);

  const systemMetrics = {
    totalUsers: 1247,
    activeUsers: 89,
    totalCourses: 234,
    systemUptime: '99.9%',
    avgResponseTime: '120ms',
    errorRate: '0.1%'
  };

  const securityAlerts = [
    { id: 1, type: 'high', message: 'Multiple failed login attempts detected', time: '10m ago' },
    { id: 2, type: 'medium', message: 'Unusual API usage pattern', time: '1h ago' },
  ];

  const userActivity = [
    { action: 'New user registration', count: 15, trend: '+5%' },
    { action: 'Course completions', count: 42, trend: '+12%' },
    { action: 'Login sessions', count: 156, trend: '+3%' },
  ];

  const systemHealth = [
    { component: 'API Services', status: 'operational', uptime: '100%' },
    { component: 'Database', status: 'warning', uptime: '98.5%' },
    { component: 'CDN', status: 'operational', uptime: '99.9%' },
    { component: 'Auth Service', status: 'operational', uptime: '100%' },
  ];

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
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
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Critical Alerts */}
          {securityAlerts.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      <LocalizedText text={`${securityAlerts.length} Security Alerts`} />
                    </p>
                    <p className="text-xs text-red-600">
                      <LocalizedText text="Requires immediate attention" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Users" />
                    </p>
                    <p className="text-lg font-semibold">{systemMetrics.totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Active Now" />
                    </p>
                    <p className="text-lg font-semibold">{systemMetrics.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Users" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Center" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="View Analytics" />
              </Button>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="System Health" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <Badge variant="default" className="bg-green-100 text-green-700">{systemMetrics.systemUptime}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time</span>
                <span className="font-semibold text-sm">{systemMetrics.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">{systemMetrics.errorRate}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* User Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <UserCheck className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-gray-500">Total Users</p>
                <p className="text-lg font-semibold">{systemMetrics.totalUsers.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <Activity className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-xs text-gray-500">Active Users</p>
                <p className="text-lg font-semibold">{systemMetrics.activeUsers}</p>
              </CardContent>
            </Card>
          </div>

          {/* User Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Recent Activity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">Last 24 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{activity.count}</p>
                    <p className={`text-xs ${activity.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.trend}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Management Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="User Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="View All Users" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                <LocalizedText text="Pending Approvals" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                <LocalizedText text="Suspended Accounts" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {/* Security Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Alerts" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg ${
                  alert.type === 'high' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-medium text-sm ${
                      alert.type === 'high' ? 'text-red-700' : 'text-yellow-700'
                    }`}>{alert.message}</p>
                    <Badge variant={alert.type === 'high' ? 'destructive' : 'default'}>
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Security Center" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Logs" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                <LocalizedText text="Access Control" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <LocalizedText text="Threat Detection" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {/* System Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="System Status" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemHealth.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{component.component}</p>
                    <p className="text-xs text-gray-500">Uptime: {component.uptime}</p>
                  </div>
                  <Badge variant={
                    component.status === 'operational' ? 'default' : 
                    component.status === 'warning' ? 'secondary' : 'destructive'
                  } className={
                    component.status === 'operational' ? 'bg-green-100 text-green-700' :
                    component.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''
                  }>
                    {component.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="System Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                <LocalizedText text="Database Health" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Platform Settings" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="Performance Metrics" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
