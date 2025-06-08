
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, Activity, AlertTriangle, TrendingUp, Database, Server, Clock } from 'lucide-react';
import { useMetricsDashboard } from '@/hooks/useMetricsDashboard';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { LocalizedText } from '@/components/LocalizedText';

export const AdminPanelDashboard = () => {
  const { metrics, loading } = useMetricsDashboard();
  const securityState = useSecurityMonitor();

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
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
      {/* Security Alert */}
      {securityState.threatLevel !== 'low' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-orange-800">
                  <LocalizedText text="Security Alert" />
                </p>
                <p className="text-sm text-orange-600">
                  <LocalizedText text={`${securityState.activeThreats.length} threat(s) detected`} />
                </p>
              </div>
              <Badge className={getSecurityBadgeColor(securityState.threatLevel)}>
                {securityState.threatLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <LocalizedText text="Active platform users" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Concurrent Users" />
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
              <LocalizedText text="Response Time" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Average response time" />
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
                <LocalizedText text="Healthy" />
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="All systems operational" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <LocalizedText text="Platform Analytics" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Key performance indicators" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Total Courses" />
              </span>
              <span className="font-semibold">{metrics.totalCourses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Total Lessons" />
              </span>
              <span className="font-semibold">{metrics.totalLessons}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Weekly Completion Rate" />
              </span>
              <span className="font-semibold">{metrics.weeklyCompletionRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <LocalizedText text="Security Overview" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Platform security status" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Threat Level" />
              </span>
              <Badge className={getSecurityBadgeColor(securityState.threatLevel)}>
                {securityState.threatLevel}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Active Threats" />
              </span>
              <span className="font-semibold">{securityState.activeThreats.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                <LocalizedText text="Last Security Check" />
              </span>
              <span className="text-xs text-gray-500">
                {securityState.lastSecurityCheck.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
