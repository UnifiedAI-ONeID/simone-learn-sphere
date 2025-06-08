import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Shield, Activity, AlertTriangle, Settings, Database, BarChart3, UserCheck, Lock, Server, Globe, FileText, TrendingUp, Zap, Monitor, Clock, DollarSign, BookOpen } from 'lucide-react';
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
    errorRate: '0.1%',
    revenue: '$24,580',
    growth: '+12%'
  };

  const securityAlerts = [
    { id: 1, type: 'high', message: 'Multiple failed login attempts detected from IP 192.168.1.100', time: '5m ago', severity: 'Critical' },
    { id: 2, type: 'medium', message: 'Unusual API usage pattern detected', time: '1h ago', severity: 'Warning' },
    { id: 3, type: 'low', message: 'Certificate expiring in 30 days', time: '1d ago', severity: 'Info' },
  ];

  const userActivity = [
    { action: 'New user registrations', count: 23, trend: '+8%', period: 'Today' },
    { action: 'Course completions', count: 67, trend: '+15%', period: 'This week' },
    { action: 'Login sessions', count: 342, trend: '+5%', period: 'Today' },
    { action: 'Payment transactions', count: 89, trend: '+22%', period: 'This week' },
  ];

  const systemHealth = [
    { component: 'API Services', status: 'operational', uptime: '100%', responseTime: '85ms' },
    { component: 'Database', status: 'warning', uptime: '98.5%', responseTime: '120ms' },
    { component: 'CDN', status: 'operational', uptime: '99.9%', responseTime: '45ms' },
    { component: 'Auth Service', status: 'operational', uptime: '100%', responseTime: '95ms' },
    { component: 'Payment Gateway', status: 'operational', uptime: '99.8%', responseTime: '180ms' },
    { component: 'Email Service', status: 'operational', uptime: '99.7%', responseTime: '200ms' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', joined: '2 hours ago', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'educator', joined: '4 hours ago', status: 'pending' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'student', joined: '1 day ago', status: 'active' },
  ];

  const platformStats = {
    totalRevenue: '$24,580',
    monthlyActiveUsers: 892,
    courseCompletions: 156,
    certificatesIssued: 89,
    supportTickets: 23,
    serverLoad: 67
  };

  const contentModeration = [
    { id: 1, type: 'course', title: 'Advanced JavaScript Patterns', status: 'pending_review', submitter: 'Alice Teacher', time: '2h ago' },
    { id: 2, type: 'discussion', title: 'Question about React hooks', status: 'flagged', submitter: 'Bob Student', time: '4h ago' },
    { id: 3, type: 'review', title: 'Course feedback', status: 'approved', submitter: 'Carol Learner', time: '6h ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
          {/* Critical Alerts */}
          {securityAlerts.filter(alert => alert.type === 'high').length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      <LocalizedText text={`${securityAlerts.filter(alert => alert.type === 'high').length} Critical Security Alerts`} />
                    </p>
                    <p className="text-xs text-red-600">
                      <LocalizedText text="Requires immediate attention" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Overview Stats */}
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
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Revenue" />
                    </p>
                    <p className="text-lg font-semibold">{platformStats.totalRevenue}</p>
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
                <LocalizedText text="User Management" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Center" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="Analytics Dashboard" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Platform Settings" />
              </Button>
            </CardContent>
          </Card>

          {/* System Health Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Monitor className="h-4 w-4 mr-2" />
                <LocalizedText text="System Health" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overall Uptime</span>
                <Badge className="bg-green-100 text-green-700">{systemMetrics.systemUptime}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-semibold text-sm">{systemMetrics.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <Badge className="bg-green-100 text-green-700">{systemMetrics.errorRate}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <span className="font-semibold text-sm">{systemMetrics.activeUsers}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Platform Activity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.period}</p>
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
                <p className="text-xs text-gray-500">Monthly Active</p>
                <p className="text-lg font-semibold">{platformStats.monthlyActiveUsers}</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Recent Registrations" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">Joined {user.joined}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs mb-1">
                        {user.role}
                      </Badge>
                      <br />
                      <Badge 
                        className={`text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="User Activity Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.period}</p>
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
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="User Analytics" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {/* Security Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Shield className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-xs text-gray-500">Threat Level</p>
                <p className="text-lg font-semibold text-green-600">Low</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-xs text-gray-500">Active Alerts</p>
                <p className="text-lg font-semibold">{securityAlerts.length}</p>
              </CardContent>
            </Card>
          </div>

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
                <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="font-medium text-sm">{alert.message}</p>
                    </div>
                  </div>
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
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                <LocalizedText text="Audit Reports" />
              </Button>
            </CardContent>
          </Card>

          {/* Security Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Security Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Login Attempts</span>
                <span className="font-semibold">23 (24h)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Blocked IPs</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SSL Certificate</span>
                <Badge className="bg-green-100 text-green-700">Valid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">2FA Adoption</span>
                <span className="font-semibold">78%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {/* System Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Server className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                <p className="text-xs text-gray-500">Server Load</p>
                <p className="text-lg font-semibold">{platformStats.serverLoad}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <Zap className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="text-lg font-semibold">{systemMetrics.systemUptime}</p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="System Components" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemHealth.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{component.component}</p>
                      <Badge className={getStatusColor(component.status)}>
                        {component.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Uptime: {component.uptime}</span>
                      <span>Response: {component.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Performance Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Server Load</span>
                  <span>{platformStats.serverLoad}%</span>
                </div>
                <Progress value={platformStats.serverLoad} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="font-semibold">2.4GB / 8GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="font-semibold">45% (450GB)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Traffic</span>
                <span className="font-semibold">2.3TB</span>
              </div>
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
                <LocalizedText text="Performance Reports" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                <LocalizedText text="CDN Management" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {/* Content Overview */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <BookOpen className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                <p className="text-xs text-gray-500">Total Courses</p>
                <p className="text-lg font-semibold">{systemMetrics.totalCourses}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <FileText className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                <p className="text-xs text-gray-500">Pending Reviews</p>
                <p className="text-lg font-semibold">{contentModeration.filter(c => c.status === 'pending_review').length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Moderation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Content Moderation Queue" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contentModeration.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">by {item.submitter} • {item.time}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        item.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                        item.status === 'flagged' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Platform Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Platform Statistics" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Course Completions</span>
                <span className="font-semibold">{platformStats.courseCompletions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificates Issued</span>
                <span className="font-semibold">{platformStats.certificatesIssued}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Support Tickets</span>
                <span className="font-semibold">{platformStats.supportTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Rating</span>
                <span className="font-semibold">4.7/5</span>
              </div>
            </CardContent>
          </Card>

          {/* Content Management Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <LocalizedText text="Content Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                <LocalizedText text="Review Pending Content" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Courses" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Educator Applications" />
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                <LocalizedText text="Content Analytics" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
