
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { EnhancedStudentDashboard } from '@/components/EnhancedStudentDashboard';
import { CourseCatalog } from '@/components/CourseCatalog';
import { AIStudyAssistant } from '@/components/AIStudyAssistant';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';

const StudentDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking();

  useEffect(() => {
    trackPageView('student_dashboard');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader 
        title="Student Dashboard"
        subtitle="Track your progress and accelerate your learning with AI"
      />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">Browse Courses</TabsTrigger>
            <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <EnhancedStudentDashboard />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CourseCatalog />
          </TabsContent>
          
          <TabsContent value="ai-tutor" className="space-y-6">
            <AIStudyAssistant />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Learning Progress</h2>
              <p className="text-gray-600">Detailed progress tracking coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
