import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, BookOpen, TrendingUp, Plus, Eye, Edit } from 'lucide-react';
import { useEducatorAnalytics } from '@/hooks/useEducatorAnalytics';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const MobileEducatorDashboard = () => {
  const { totalCourses, totalStudents, avgRating, totalRevenue } = useEducatorAnalytics();

  const quickActions = [
    { label: 'Create New Course', icon: Plus, description: 'Start building your next course' },
    { label: 'Edit Existing Course', icon: Edit, description: 'Update course content and settings' },
    { label: 'View Course Analytics', icon: Eye, description: 'Track student progress and engagement' },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="Educator Dashboard" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Manage your courses and track student progress" />
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Total Courses" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Number of courses you've created" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Total Students" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Number of students currently enrolled in your courses" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Average Rating" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Average rating across all your courses" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgRating}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Total Revenue" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Total revenue generated from your courses" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          <UnifiedLocalizedText text="Quick Actions" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:bg-secondary/10 cursor-pointer">
              <CardContent className="flex items-center space-x-4">
                <action.icon className="h-5 w-5 text-primary" />
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

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          <UnifiedLocalizedText text="Recent Activity" />
        </h2>
        <Card>
          <CardContent>
            <p className="text-muted-foreground">
              <UnifiedLocalizedText text="No recent activity to display." />
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
