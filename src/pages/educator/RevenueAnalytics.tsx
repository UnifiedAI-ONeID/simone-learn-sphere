import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, BarChart3, Download } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const RevenueAnalytics = () => {
  const revenueData = {
    totalRevenue: 12500,
    monthlyGrowth: 7.5,
    topCourse: "React Fundamentals",
    downloads: 325
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          <UnifiedLocalizedText text="Revenue Analytics" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Track your earnings and performance" />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <UnifiedLocalizedText text="Total Revenue" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Overall earnings from your courses" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${revenueData.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">
                  +{revenueData.monthlyGrowth}% <UnifiedLocalizedText text="Monthly growth" />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <UnifiedLocalizedText text="Top Performing Course" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Your most popular course" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{revenueData.topCourse}</div>
              <div className="flex items-center mt-2">
                <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-500">
                  <UnifiedLocalizedText text="View detailed analytics" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <UnifiedLocalizedText text="Downloads" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Total downloads of course materials" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{revenueData.downloads}</div>
              <div className="flex items-center mt-2">
                <Download className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  <UnifiedLocalizedText text="Track download trends" />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <UnifiedLocalizedText text="Earnings Breakdown" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Revenue distribution by course" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>React Fundamentals</span>
                  <span>$7,500</span>
                </div>
                <Progress value={60} />
                <div className="flex justify-between">
                  <span>JavaScript ES6+</span>
                  <span>$5,000</span>
                </div>
                <Progress value={40} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
