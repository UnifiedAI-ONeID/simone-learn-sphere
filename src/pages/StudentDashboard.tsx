
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnhancedStudentDashboard } from '@/components/EnhancedStudentDashboard';
import { CourseCatalog } from '@/components/CourseCatalog';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useEffect } from 'react';

const StudentDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking();

  useEffect(() => {
    trackPageView('student_dashboard');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedStudentDashboard />
          </TabsContent>
          
          <TabsContent value="catalog" className="space-y-6">
            <CourseCatalog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
