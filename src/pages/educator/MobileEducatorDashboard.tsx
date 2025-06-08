
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, DollarSign, TrendingUp, Plus, BarChart3 } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const MobileEducatorDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          <UnifiedLocalizedText text="Educator Dashboard" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Manage your courses and track student progress" />
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-20 flex flex-col items-center justify-center space-y-2">
          <Plus className="h-6 w-6" />
          <span className="text-sm">
            <UnifiedLocalizedText text="New Course" />
          </span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-sm">
            <UnifiedLocalizedText text="Analytics" />
          </span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Active Courses" />
                </h3>
                <p className="text-2xl font-bold text-blue-600">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Total Students" />
                </h3>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Revenue" />
                </h3>
                <p className="text-2xl font-bold text-purple-600">$0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <UnifiedLocalizedText text="Get Started" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Create your first course to start teaching" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">
                  <UnifiedLocalizedText text="Create Your First Course" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <UnifiedLocalizedText text="Use our AI-powered course builder" />
                </p>
              </div>
              <Button size="sm">
                <UnifiedLocalizedText text="Start" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">
                  <UnifiedLocalizedText text="Set Up Your Profile" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <UnifiedLocalizedText text="Add bio and teaching experience" />
                </p>
              </div>
              <Button variant="outline" size="sm">
                <UnifiedLocalizedText text="Setup" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
