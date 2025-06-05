
import { DashboardHeader } from '@/components/DashboardHeader';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { UserManagement } from '@/components/UserManagement';
import { ImpersonationBanner } from '@/components/ImpersonationBanner';
import { TranslatedText } from '@/components/TranslatedText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Shield, BarChart3, Settings, Crown } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ImpersonationBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          title="Admin Dashboard"
          subtitle="Manage platform operations, users, and security"
          badgeText="Administrator"
          badgeIcon={Crown}
        />
        
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <TranslatedText text="Metrics" />
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <TranslatedText text="Users" />
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <TranslatedText text="Security" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <TranslatedText text="Settings" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
            <MetricsDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                <TranslatedText text="Settings Coming Soon" />
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                <TranslatedText text="Platform settings and configuration options will be available here." />
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
