
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Database, 
  Server, 
  Clock,
  DollarSign,
  Eye,
  Bot,
  Globe,
  UserCheck,
  FileText,
  Settings
} from 'lucide-react';
import { useMetricsDashboard } from '@/hooks/useMetricsDashboard';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { LocalizedText } from '@/components/LocalizedText';

export const AdminPanelDashboard = () => {
  const { metrics, loading } = useMetricsDashboard();
  const securityState = useSecurityMonitor();

  // Mock additional admin data
  const revenueData = {
    totalRevenue: 45780,
    monthlyRevenue: 8950,
    pendingPayouts: 12300,
    affiliateEarnings: 2150
  };

  const recentReports = [
    { id: 1, type: 'Content', description: 'Inappropriate content in React course', status: 'pending', time: '2 hours ago' },
    { id: 2, type: 'User', description: 'Spam behavior reported', status: 'reviewed', time: '1 day ago' },
    { id: 3, type: 'Technical', description: 'API timeout issues', status: 'resolved', time: '2 days ago' }
  ];

  const aiUsageStats = {
    totalQueries: 15420,
    suspiciousPatterns: 3,
    blockedQueries: 12,
    avgResponseTime: 1.2
  };

  const regionalBreakdown = [
    { region: 'North America', users: 8450, revenue: 22400 },
    { region: 'Europe', users: 6200, revenue: 15300 },
    { region: 'Asia Pacific', users: 4800, revenue: 8080 }
  ];

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Security Alerts */}
      {securityState.threatLevel !== 'low' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">
                  <LocalizedText text="Security Alert" />
                </p>
                <p className="text-sm text-red-600">
                  <LocalizedText text={`${securityState.activeThreats.length} threat(s) detected - Immediate attention required`} />
                </p>
              </div>
              <Badge className={getSecurityBadgeColor(securityState.threatLevel)}>
                {securityState.threatLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Active Users" />
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.concurrentUsers}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Currently online" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Users" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="+12% this month" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Global Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="All time platform revenue" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="System Health" />
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <LocalizedText text="Optimal" />
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="99.9% uptime" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <LocalizedText text="Revenue & Payouts" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Platform financial overview" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-xl font-bold">${revenueData.monthlyRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Pending Payouts</p>
                <p className="text-xl font-bold">${revenueData.pendingPayouts.toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Regional Breakdown</h4>
              <div className="space-y-2">
                {regionalBreakdown.map((region, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{region.region}</p>
                      <p className="text-xs text-gray-600">{region.users.toLocaleString()} users</p>
                    </div>
                    <p className="font-semibold">${region.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              <LocalizedText text="User Management" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Platform user statistics and controls" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(metrics.totalUsers * 0.7)}
                </p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(metrics.totalUsers * 0.25)}
                </p>
                <p className="text-xs text-gray-600">Educators</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(metrics.totalUsers * 0.05)}
                </p>
                <p className="text-xs text-gray-600">Admins</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage All Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Impersonate User
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Suspend/Reactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Usage Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <LocalizedText text="AI Usage Monitor" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Track AI queries and detect suspicious patterns" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Queries</p>
                <p className="text-xl font-bold">{aiUsageStats.totalQueries.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-xl font-bold">{aiUsageStats.avgResponseTime}s</p>
              </div>
            </div>
            
            {aiUsageStats.suspiciousPatterns > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-orange-800">Suspicious Patterns Detected</p>
                    <p className="text-sm text-orange-600">{aiUsageStats.suspiciousPatterns} patterns flagged</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Blocked Queries</span>
              <Badge variant="secondary">{aiUsageStats.blockedQueries}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports & Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <LocalizedText text="Recent Reports" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Content moderation and user reports" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      {report.type}
                    </Badge>
                    <p className="text-sm">{report.description}</p>
                  </div>
                  <Badge className={getStatusColor(report.status)} variant="secondary">
                    {report.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{report.time}</span>
                  {report.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <LocalizedText text="Platform Configuration" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Configure platform-wide settings and export data" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              <LocalizedText text="Theme Settings" />
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              <LocalizedText text="Security Limits" />
            </Button>
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              <LocalizedText text="Export Analytics" />
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              <LocalizedText text="Audit Logs" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
