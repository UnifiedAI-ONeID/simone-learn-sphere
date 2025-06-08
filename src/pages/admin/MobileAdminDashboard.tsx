import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, TrendingUp, AlertTriangle, Settings, Shield } from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const MobileAdminDashboard = () => {
  const { totalUsers, activeCourses, engagementRate, securityAlerts } = useAdminAnalytics();

  const quickActions = [
    { label: 'Manage Users', description: 'Add, edit, or remove user accounts', icon: Users },
    { label: 'Create Course', description: 'Design and publish new learning content', icon: BookOpen },
    { label: 'Review Analytics', description: 'Monitor platform performance and user engagement', icon: TrendingUp },
    { label: 'Check Security', description: 'Review security logs and threat alerts', icon: Shield },
    { label: 'System Settings', description: 'Configure system-wide settings and preferences', icon: Settings },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="Mobile Admin Dashboard" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Overview of platform performance and key metrics" />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Total Users" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Number of registered users" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Active Courses" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Number of courses currently active" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCourses}</div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span><UnifiedLocalizedText text="5 new courses added" /></span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Engagement Rate" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="User engagement with platform content" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{engagementRate}%</div>
            <Progress value={engagementRate} className="mb-2" />
            <div className="text-sm text-muted-foreground">
              <UnifiedLocalizedText text="Target: 80%" />
            </div>
          </CardContent>
        </Card>
      </div>

      {securityAlerts > 0 && (
        <Card className="border-destructive text-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <UnifiedLocalizedText text="Security Alerts" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Review and address security concerns" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{securityAlerts}</div>
            <Button variant="destructive" className="mt-4">
              <UnifiedLocalizedText text="View Security Logs" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          <UnifiedLocalizedText text="Quick Actions" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Card key={action.label} className="hover:bg-secondary/10 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <div className="rounded-md bg-muted p-2">
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    <UnifiedLocalizedText text={action.label} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <UnifiedLocalizedText text={action.description} />
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
