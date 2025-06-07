
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnhancedEducatorDashboard } from '@/components/EnhancedEducatorDashboard';
import { CourseCreator } from '@/components/CourseCreator';
import { AICoursePlanner } from '@/components/AICoursePlanner';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useEffect } from 'react';

const EducatorDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking();

  useEffect(() => {
    trackPageView('educator_dashboard');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <DashboardHeader 
        title="Educator Dashboard"
        subtitle="Manage your courses and track student engagement with AI assistance"
      />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="ai-planner">AI Planner</TabsTrigger>
            <TabsTrigger value="content-gen">AI Content</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedEducatorDashboard />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Course Management</h2>
              <p className="text-gray-600">Detailed course management interface coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-planner" className="space-y-6">
            <AICoursePlanner />
          </TabsContent>
          
          <TabsContent value="content-gen" className="space-y-6">
            <AIContentGenerator />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-6">
            <CourseCreator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducatorDashboard;
