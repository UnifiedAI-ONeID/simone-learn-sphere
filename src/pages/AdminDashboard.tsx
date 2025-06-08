import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { AdminPanelDashboard } from '@/components/AdminPanelDashboard';
import { UserManagement } from '@/components/UserManagement';
import { SystemMetrics } from '@/components/SystemMetrics';
import { SecurityMonitoring } from '@/components/SecurityMonitoring';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

const AdminDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  const { platform } = usePlatformTheme();
  useSessionTracking();

  useEffect(() => {
    trackPageView('admin_dashboard');
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
        return "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full font-medium uppercase tracking-wide text-xs";
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
              <UnifiedLocalizedText text="Admin Dashboard" />
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              <UnifiedLocalizedText text="Manage platform operations, users, and monitor system health" />
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-5 max-w-3xl mx-auto ${getTabsStyles()}`}>
            <TabsTrigger value="dashboard" className={getTabTriggerStyles()}>
              <UnifiedLocalizedText text="Overview" />
            </TabsTrigger>
            <TabsTrigger value="users" className={getTabTriggerStyles()}>
              <UnifiedLocalizedText text="Users" />
            </TabsTrigger>
            <TabsTrigger value="metrics" className={getTabTriggerStyles()}>
              <UnifiedLocalizedText text="Metrics" />
            </TabsTrigger>
            <TabsTrigger value="security" className={getTabTriggerStyles()}>
              <UnifiedLocalizedText text="Security" />
            </TabsTrigger>
            <TabsTrigger value="settings" className={getTabTriggerStyles()}>
              <UnifiedLocalizedText text="Settings" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <AdminPanelDashboard />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-6">
            <SystemMetrics />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecurityMonitoring />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
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
                <UnifiedLocalizedText text="System Settings" />
              </h2>
              <p className="text-muted-foreground">
                <UnifiedLocalizedText text="Advanced system configuration coming soon..." />
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </PlatformLayout>
  );
};

export default AdminDashboard;
