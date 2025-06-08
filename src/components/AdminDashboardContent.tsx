
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Activity, Server, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const AdminDashboardContent = () => {
  const adminAnalytics = {
    totalUsers: 12457,
    activeUsers: 8923,
    totalCourses: 156,
    systemHealth: 98,
    securityAlerts: 2,
    pendingApprovals: 5
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Total Users" />
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAnalytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> <UnifiedLocalizedText text="from last month" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Active Users" />
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAnalytics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> <UnifiedLocalizedText text="from last week" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="System Health" />
            </CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAnalytics.systemHealth}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                <CheckCircle className="h-3 w-3 inline mr-1" />
                <UnifiedLocalizedText text="All systems operational" />
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <UnifiedLocalizedText text="Security Alerts" />
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminAnalytics.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <UnifiedLocalizedText text="Requires attention" />
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>
            <UnifiedLocalizedText text="Quick Actions" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Frequently used administrative tasks" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <UnifiedLocalizedText text="Manage Users" />
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <UnifiedLocalizedText text="View Analytics" />
            </Button>
            <Button className="h-20 flex-col gap-2" variant="outline">
              <Shield className="h-6 w-6" />
              <UnifiedLocalizedText text="Security Center" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>
            <UnifiedLocalizedText text="Recent Activity" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Latest platform activities and events" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">
                  <UnifiedLocalizedText text="New user registered" />
                </span>
              </div>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  <UnifiedLocalizedText text="Course updated" />
                </span>
              </div>
              <span className="text-xs text-muted-foreground">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">
                  <UnifiedLocalizedText text="Security alert resolved" />
                </span>
              </div>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
