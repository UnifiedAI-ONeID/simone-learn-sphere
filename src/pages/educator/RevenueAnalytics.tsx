
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Users, Download, Calendar } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const RevenueAnalytics = () => {
  const revenueData = [
    { course: "React Fundamentals", students: 156, revenue: 4680, growth: 12 },
    { course: "Advanced JavaScript", students: 89, revenue: 2670, growth: -5 },
    { course: "UI/UX Design", students: 203, revenue: 6090, growth: 23 },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <LocalizedText text="Revenue Analytics" />
              </h1>
              <p className="text-muted-foreground">
                <LocalizedText text="Track your earnings and course performance" />
              </p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 3 months</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                <LocalizedText text="Export" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$13,440</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">448</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Course Price</p>
                <p className="text-2xl font-bold">$30</p>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Payout</p>
                <p className="text-2xl font-bold">$2,156</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Jun 15, 2024
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlatformCard>
            <h2 className="text-xl font-semibold mb-4">
              <LocalizedText text="Course Performance" />
            </h2>
            <div className="space-y-4">
              {revenueData.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{course.course}</h3>
                    <p className="text-sm text-muted-foreground">{course.students} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${course.revenue.toLocaleString()}</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      course.growth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${course.growth < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(course.growth)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </PlatformCard>

          <PlatformCard>
            <h2 className="text-xl font-semibold mb-4">
              <LocalizedText text="Revenue Timeline" />
            </h2>
            <div className="h-64 flex items-center justify-center border rounded bg-muted/20">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Revenue chart visualization</p>
                <p className="text-sm">Chart component would be implemented here</p>
              </div>
            </div>
          </PlatformCard>
        </div>

        <PlatformCard className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            <LocalizedText text="Payout History" />
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Method</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">May 15, 2024</td>
                  <td className="p-2">$1,890</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                  </td>
                  <td className="p-2">Bank Transfer</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Apr 15, 2024</td>
                  <td className="p-2">$2,340</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                  </td>
                  <td className="p-2">Bank Transfer</td>
                </tr>
                <tr>
                  <td className="p-2">Mar 15, 2024</td>
                  <td className="p-2">$1,650</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                  </td>
                  <td className="p-2">Bank Transfer</td>
                </tr>
              </tbody>
            </table>
          </div>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
