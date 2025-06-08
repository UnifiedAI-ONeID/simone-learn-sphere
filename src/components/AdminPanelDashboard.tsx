
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
} from 'lucide-react';

export const AdminPanelDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for key metrics
  const [totalUsers, setTotalUsers] = useState(12457);
  const [activeSessions, setActiveSessions] = useState(1834);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [securityScore, setSecurityScore] = useState('A+');

  // Mock data for recent activity
  const [recentActivity, setRecentActivity] = useState([
    { type: 'user', message: 'New user registration', time: '2 minutes ago', status: 'success' },
    { type: 'course', message: 'Course "React Fundamentals" updated', time: '15 minutes ago', status: 'info' },
    { type: 'security', message: 'Security scan completed', time: '1 hour ago', status: 'success' },
    { type: 'system', message: 'Database backup completed', time: '2 hours ago', status: 'success' }
  ]);

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
          <Button variant="outline">
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
          All systems operational. Last updated 2 minutes ago.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                <div className="text-2xl font-bold">12,457</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Sessions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,834</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Health
                </CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                  Excellent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Security Score
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">A+</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">No threats detected</span>
                </p>
              </CardContent>
            </Card>
          </div>

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
              <div className="space-y-4">
                {[
                  { type: 'user', message: 'New user registration', time: '2 minutes ago', status: 'success' },
                  { type: 'course', message: 'Course "React Fundamentals" updated', time: '15 minutes ago', status: 'info' },
                  { type: 'security', message: 'Security scan completed', time: '1 hour ago', status: 'success' },
                  { type: 'system', message: 'Database backup completed', time: '2 hours ago', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm">
                        {activity.message}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  User management interface coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Security Center
              </CardTitle>
              <CardDescription>
                Monitor security threats and system vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Security monitoring dashboard coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                System Reports
              </CardTitle>
              <CardDescription>
                Generate and download system reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Reporting system coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
