
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, Globe } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const PlatformAnalytics = () => {
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
                <p className="text-2xl font-bold">12,486</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% from last week
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                <p className="text-2xl font-bold">324</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last week
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform Revenue</p>
                <p className="text-2xl font-bold">$89,234</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +22% from last week
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Active Users</p>
                <p className="text-2xl font-bold">3,247</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Peak: 4,123
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
                <p className="text-sm">Chart visualization would be here</p>
              </div>
            </div>
          </PlatformCard>

          <PlatformCard>
            <h2 className="text-xl font-semibold mb-4">
              <LocalizedText text="Regional Distribution" />
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">North America</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Europe</span>
                </div>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Asia</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">Other</span>
                </div>
                <span className="text-sm font-medium">5%</span>
              </div>
            </div>
          </PlatformCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="Top Courses" />
            </h3>
            <div className="space-y-2">
              {[
                { name: "React Fundamentals", students: 456 },
                { name: "Python for Beginners", students: 389 },
                { name: "UI/UX Design", students: 324 },
                { name: "Data Science Intro", students: 298 }
              ].map((course, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{course.name}</span>
                  <span className="font-medium">{course.students}</span>
                </div>
              ))}
            </div>
          </PlatformCard>

          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="User Roles" />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Students</span>
                <span className="font-medium">10,234 (82%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Educators</span>
                <span className="font-medium">2,156 (17%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Admins</span>
                <span className="font-medium">96 (1%)</span>
              </div>
            </div>
          </PlatformCard>

          <PlatformCard>
            <h3 className="font-semibold mb-3">
              <LocalizedText text="Platform Health" />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uptime</span>
                <span className="font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Response Time</span>
                <span className="font-medium">120ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Error Rate</span>
                <span className="font-medium text-green-600">0.1%</span>
              </div>
            </div>
          </PlatformCard>
        </div>
      </div>
    </PlatformLayout>
  );
};
