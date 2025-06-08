
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, DollarSign, Shield, Settings, BarChart3 } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const MobileAdminDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          <UnifiedLocalizedText text="Admin Dashboard" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Manage platform and monitor activity" />
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="h-20 flex flex-col items-center justify-center space-y-2">
          <Users className="h-6 w-6" />
          <span className="text-sm">
            <UnifiedLocalizedText text="Users" />
          </span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-sm">
            <UnifiedLocalizedText text="Analytics" />
          </span>
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Total Users" />
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
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Active Courses" />
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">
                  <UnifiedLocalizedText text="Security Score" />
                </h3>
                <p className="text-2xl font-bold text-orange-600">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <UnifiedLocalizedText text="System Status" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              <UnifiedLocalizedText text="Platform Status" />
            </span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <UnifiedLocalizedText text="Operational" />
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">
              <UnifiedLocalizedText text="Security Alerts" />
            </span>
            <Badge variant="outline">
              <UnifiedLocalizedText text="None" />
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <UnifiedLocalizedText text="Quick Actions" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Manage Users" />
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="View Analytics" />
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="System Settings" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
