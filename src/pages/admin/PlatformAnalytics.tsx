
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export const PlatformAnalytics = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Platform Analytics
        </h1>
        <p className="text-gray-600">
          Monitor key metrics and trends across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Users
            </CardTitle>
            <CardDescription>
              Number of registered users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,457</div>
            <div className="text-sm text-gray-500">
              +357 this month
            </div>
          </CardContent>
        </Card>

        {/* Active Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Active Courses
            </CardTitle>
            <CardDescription>
              Number of courses with active enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-gray-500">
              +5 new courses this month
            </div>
          </CardContent>
        </Card>

        {/* Engagement Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Rate
            </CardTitle>
            <CardDescription>
              Percentage of active users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <div className="text-sm text-green-500">
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest user and platform activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              New user registered
              <span className="text-sm text-gray-500">10 minutes ago</span>
            </li>
            <li className="flex justify-between items-center">
              Course 'React Fundamentals' updated
              <span className="text-sm text-gray-500">30 minutes ago</span>
            </li>
            <li className="flex justify-between items-center">
              Admin settings modified
              <span className="text-sm text-gray-500">1 hour ago</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
