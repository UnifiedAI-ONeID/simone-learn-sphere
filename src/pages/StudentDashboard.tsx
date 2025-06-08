
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { StudentDashboardContent } from '@/components/StudentDashboardContent';
import { CourseCatalog } from '@/components/CourseCatalog';
import { AIStudyAssistant } from '@/components/AIStudyAssistant';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const StudentDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  const { platform } = usePlatformTheme();
  useSessionTracking();

  useEffect(() => {
    trackPageView('student_dashboard');
  }, [trackPageView]);

  const getTabsStyles = () => {
    switch (platform) {
      case 'ios':
        return "rounded-xl bg-background/80 backdrop-blur-md border border-border/50";
      case 'android':
        return "rounded-3xl bg-card shadow-lg border-0";
      case 'desktop':
        return "rounded-lg bg-card border border-border shadow-sm";
      default:
        return "bg-card";
    }
  };

  const getTabTriggerStyles = () => {
    switch (platform) {
      case 'ios':
        return "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg font-medium";
      case 'android':
        return "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full font-medium uppercase tracking-wide text-sm";
      case 'desktop':
        return "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md";
      default:
        return "";
    }
  };

  return (
    <PlatformLayout className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Platform-aware header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className={`font-bold text-foreground ${
              platform === 'ios' ? 'text-2xl font-semibold' : 
              platform === 'android' ? 'text-xl font-medium' : 
              'text-3xl font-bold'
            }`}>
              Student Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track your progress and accelerate your learning with AI
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-4 max-w-2xl mx-auto ${getTabsStyles()}`}>
            <TabsTrigger value="dashboard" className={getTabTriggerStyles()}>
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className={getTabTriggerStyles()}>
              Browse Courses
            </TabsTrigger>
            <TabsTrigger value="ai-tutor" className={getTabTriggerStyles()}>
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="progress" className={getTabTriggerStyles()}>
              My Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <StudentDashboardContent />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CourseCatalog />
          </TabsContent>
          
          <TabsContent value="ai-tutor" className="space-y-6">
            <AIStudyAssistant />
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-6">
            <div className={`p-6 ${
              platform === 'ios' ? 'bg-card rounded-xl border border-border' :
              platform === 'android' ? 'bg-card rounded-3xl shadow-lg' :
              'bg-card rounded-lg border border-border shadow-sm'
            }`}>
              <h2 className={`mb-4 text-foreground ${
                platform === 'ios' ? 'text-xl font-semibold' :
                platform === 'android' ? 'text-lg font-medium' :
                'text-2xl font-bold'
              }`}>
                Learning Progress
              </h2>
              <p className="text-muted-foreground">
                Detailed progress tracking coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </PlatformLayout>
  );
};

export default StudentDashboard;
