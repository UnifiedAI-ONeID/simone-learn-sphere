
import { DashboardHeader } from '@/components/DashboardHeader';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { EnhancedSecurityDashboard } from '@/components/EnhancedSecurityDashboard';
import { UserManagement } from '@/components/UserManagement';
import { RealTimeUserActivity } from '@/components/RealTimeUserActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Shield, Users, Activity, ShieldCheck } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <TranslatedText text="Admin Dashboard" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            <TranslatedText text="Comprehensive platform management and analytics" />
          </p>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <TranslatedText text="Metrics" />
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <TranslatedText text="Security" />
            </TabsTrigger>
            <TabsTrigger value="enhanced-security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <TranslatedText text="Enhanced Security" />
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <TranslatedText text="Users" />
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <TranslatedText text="Activity" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="enhanced-security">
            <EnhancedSecurityDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="activity">
            <RealTimeUserActivity />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
