import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, DollarSign, BookOpen, TrendingUp, Settings, Bell, Search } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { EducatorDashboardContent } from '@/components/EducatorDashboardContent';
import { ContextualAIHelper } from '@/components/ContextualAIHelper';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const EducatorDashboard = () => {
  const { role } = useUserRole();

  if (role !== 'educator') {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Access Denied" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="You do not have permission to view this page." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <UnifiedLocalizedText text="Please log in with an educator account to access the educator dashboard." />
            </p>
            <Button>
              <UnifiedLocalizedText text="Go to Home" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <UnifiedLocalizedText text="Educator Dashboard" />
          </h1>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Track your courses, students, and earnings" />
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Notifications" />
          </Button>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Find Students" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <UnifiedLocalizedText text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <UnifiedLocalizedText text="Courses" />
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <UnifiedLocalizedText text="Students" />
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <UnifiedLocalizedText text="Revenue" />
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <UnifiedLocalizedText text="Analytics" />
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <UnifiedLocalizedText text="Settings" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <EducatorDashboardContent />
        </TabsContent>
        <TabsContent value="courses" className="space-y-4">
          <div>
            <UnifiedLocalizedText text="Courses Content" />
          </div>
        </TabsContent>
        <TabsContent value="students" className="space-y-4">
          <div>
            <UnifiedLocalizedText text="Students Content" />
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <div>
            <UnifiedLocalizedText text="Revenue Content" />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div>
            <UnifiedLocalizedText text="Analytics Content" />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <div>
            <UnifiedLocalizedText text="Settings Content" />
          </div>
        </TabsContent>
      </Tabs>

      <ContextualAIHelper currentPage="dashboard" onSuggestionClick={(suggestion) => alert(suggestion)} />
    </div>
  );
};
