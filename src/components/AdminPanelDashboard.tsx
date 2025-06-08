
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  Globe,
  BarChart3,
  UserCheck,
  UserX,
  Brain,
  Settings,
  Eye,
  Download,
  RefreshCw,
  Activity,
  Server,
  Database,
  Zap,
  FileText,
  MessageSquare,
  Flag
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const AdminPanelDashboard = () => {
  const platformStats = {
    totalUsers: 12450,
    activeUsers: 8920,
    newSignups: 340,
    globalEngagement: 78,
    totalRevenue: 45600,
    monthlyGrowth: 15.8,
    systemUptime: 99.9
  };

  const revenueData = {
    totalRevenue: 45600,
    affiliateStats: 8900,
    pendingPayouts: 12300,
    regions: [
      { name: 'North America', revenue: 18240, percentage: 40 },
      { name: 'Europe', revenue: 13680, percentage: 30 },
      { name: 'Asia Pacific', revenue: 9120, percentage: 20 },
      { name: 'Others', revenue: 4560, percentage: 10 }
    ]
  };

  const userManagement = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'educator', status: 'active', lastSeen: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student', status: 'suspended', lastSeen: '1 day ago' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'educator', status: 'active', lastSeen: '30 min ago' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'admin', status: 'active', lastSeen: 'Online' }
  ];

  const aiUsageData = {
    totalQueries: 15420,
    monthlyQueries: 3240,
    averageResponseTime: 1.2,
    suspiciousPatterns: 3,
    flaggedContent: 12
  };

  const systemLogs = [
    { timestamp: '10:30 AM', event: 'User login spike detected', severity: 'info', details: '+25% above normal' },
    { timestamp: '10:15 AM', event: 'Payment processing error', severity: 'warning', details: 'Stripe API timeout' },
    { timestamp: '10:00 AM', event: 'Course published', severity: 'info', details: 'React Advanced by John Doe' },
    { timestamp: '09:45 AM', event: 'Suspicious activity detected', severity: 'critical', details: 'Multiple failed login attempts' }
  ];

  const recentReports = [
    { id: 1, type: 'content', description: 'Inappropriate course content reported', status: 'pending', reporter: 'Student' },
    { id: 2, type: 'user', description: 'Spam behavior in forums', status: 'resolved', reporter: 'Educator' },
    { id: 3, type: 'technical', description: 'Video playback issues', status: 'investigating', reporter: 'Student' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'info': return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800';
      default: return 'bg-background border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Platform Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Users" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{platformStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text={`${platformStats.activeUsers.toLocaleString()} active`} />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="New Signups" />
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{platformStats.newSignups}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="This week" />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Platform Revenue" />
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${platformStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text={`+${platformStats.monthlyGrowth}% this month`} />
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="System Uptime" />
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{platformStats.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Last 30 days" />
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Payouts */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <DollarSign className="h-5 w-5" />
              <LocalizedText text="Revenue & Payouts" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Global financial overview" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold text-foreground">${revenueData.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="text-sm text-muted-foreground">Pending Payouts</div>
                <div className="text-2xl font-bold text-foreground">${revenueData.pendingPayouts.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Regional Breakdown</h4>
              {revenueData.regions.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{region.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-foreground">${region.revenue.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">{region.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Financial Reports
            </Button>
          </CardContent>
        </Card>

        {/* User Management Table */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5" />
              <LocalizedText text="User Management" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Monitor and manage platform users" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {userManagement.map((user, index) => (
                <div key={index} className="p-3 border border-border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{user.name}</h4>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                          {user.role}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Last seen: {user.lastSeen}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-accent">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <UserCheck className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Usage Monitor */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5" />
              <LocalizedText text="AI Usage Monitor" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Track AI queries and detect patterns" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center justify-between">
                  <Zap className="h-8 w-8 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{aiUsageData.totalQueries.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Total Queries</p>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center justify-between">
                  <Activity className="h-8 w-8 text-primary" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{aiUsageData.averageResponseTime}s</div>
                    <p className="text-xs text-muted-foreground">Avg Response</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-100">Suspicious Patterns</span>
                </div>
                <Badge variant="destructive" className="text-xs">{aiUsageData.suspiciousPatterns}</Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                <div className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">Flagged Content</span>
                </div>
                <Badge variant="destructive" className="text-xs">{aiUsageData.flaggedContent}</Badge>
              </div>
            </div>
            
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent">
              <Shield className="h-4 w-4 mr-2" />
              View AI Audit Trail
            </Button>
          </CardContent>
        </Card>

        {/* System Logs & Uptime */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Server className="h-5 w-5" />
              <LocalizedText text="System Logs" />
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              <LocalizedText text="Monitor system health and events" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getSeverityBg(log.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        <Badge variant="outline" className={`text-xs ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-foreground mt-1">{log.event}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports / Tickets */}
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="h-5 w-5" />
            <LocalizedText text="Recent Reports & Tickets" />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <LocalizedText text="Handle user reports and platform issues" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-background">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{report.description}</h4>
                    <p className="text-sm text-muted-foreground">Reported by: {report.reporter}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {report.status === 'pending' ? 'Review' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
              <FileText className="h-4 w-4 mr-2" />
              View All Reports
            </Button>
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
              <Settings className="h-4 w-4 mr-2" />
              Moderation Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
