
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminPanelDashboard } from '@/components/AdminPanelDashboard';
import { UserManagement } from '@/components/UserManagement';
import { SystemMetrics } from '@/components/SystemMetrics';
import { SecurityMonitoring } from '@/components/SecurityMonitoring';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';

const AdminDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking();

  useEffect(() => {
    trackPageView('admin_dashboard');
  }, [trackPageView]);

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      subtitle="Manage platform operations, users, and monitor system health"
    >
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="dashboard">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
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
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-600">Advanced system configuration coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
