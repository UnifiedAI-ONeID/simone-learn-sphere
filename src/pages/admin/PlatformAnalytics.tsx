
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, Globe } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useAdminDashboardData } from '@/hooks/useDashboardData';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const PlatformAnalytics = () => {
  const { data, loading, error } = useAdminDashboardData();

  if (loading) {
    return (
      <PlatformLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </PlatformLayout>
    );
  }

  if (error) {
    return (
      <PlatformLayout>
        <PlatformCard>
          <div className="text-center p-6">
            <p className="text-destructive">Error loading analytics: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </PlatformCard>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <LocalizedText text="Platform Analytics" />
              </h1>
              <p className="text-muted-foreground">
                <LocalizedText text="Monitor platform performance and user engagement" />
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="7days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 3 months</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <LocalizedText text="Export Report" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{data?.totalUsers || 0}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Active: {data?.activeUsers || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">{data?.totalCourses || 0}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Published courses
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                <p className="text-2xl font-bold">${data?.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Total earned
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
                <p className="text-2xl font-bold">{data?.activeUsers || 0}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Currently online
                </p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PlatformCard>
            <h2 className="text-xl font-semibold mb-4">
              <LocalizedText text="User Growth" />
            </h2>
            <div className="h-64 flex items-center justify-center border rounded bg-muted/20">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>User growth chart</p>
                <p className="text-sm">Total users: {data?.totalUsers || 0}</p>
              </div>
            </div>
          </PlatformCard>

          <PlatformCard>
            <h2 className="text-xl font-semibold mb-4">
              <LocalizedText text="User Roles Distribution" />
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Students</span>
                </div>
                <span className="text-sm font-medium">
                  {data?.usersByRole?.students || 0} ({data?.totalUsers ? Math.round((data.usersByRole.students / data.totalUsers) * 100) : 0}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Educators</span>
                </div>
                <span className="text-sm font-medium">
                  {data?.usersByRole?.educators || 0} ({data?.totalUsers ? Math.round((data.usersByRole.educators / data.totalUsers) * 100) : 0}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Admins</span>
                </div>
                <span className="text-sm font-medium">
                  {data?.usersByRole?.admins || 0} ({data?.totalUsers ? Math.round((data.usersByRole.admins / data.totalUsers) * 100) : 0}%)
                </span>
              </div>
            </div>
          </PlatformCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="System Health" />
            </h3>
            <div className="space-y-2">
              {data?.systemMetrics?.map((metric, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{metric.name}</span>
                  <span className={`font-medium ${
                    metric.status === 'healthy' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metric.value}%
                  </span>
                </div>
              )) || (
                <div className="text-sm text-muted-foreground">No metrics available</div>
              )}
            </div>
          </PlatformCard>

          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="User Roles" />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Students</span>
                <span className="font-medium">{data?.usersByRole?.students || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Educators</span>
                <span className="font-medium">{data?.usersByRole?.educators || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Admins</span>
                <span className="font-medium">{data?.usersByRole?.admins || 0}</span>
              </div>
            </div>
          </PlatformCard>

          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="Platform Activity" />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Users</span>
                <span className="font-medium">{data?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium text-green-600">{data?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Activity Rate</span>
                <span className="font-medium">
                  {data?.totalUsers ? Math.round((data.activeUsers / data.totalUsers) * 100) : 0}%
                </span>
              </div>
            </div>
          </PlatformCard>
        </div>
      </div>
    </PlatformLayout>
  );
};
