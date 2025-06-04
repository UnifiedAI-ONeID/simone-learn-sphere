
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SecurityDashboard } from '@/components/SecurityDashboard';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { RealTimeUserActivity } from '@/components/RealTimeUserActivity';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  Shield,
  Settings,
  BarChart,
  Activity,
  Target
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        title="Admin Dashboard 🛡️"
        subtitle="Platform oversight and analytics"
        badgeText="Admin Access"
        badgeIcon={Shield}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="metrics">Success Metrics</TabsTrigger>
            <TabsTrigger value="activity">Live Activity</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Success Metrics Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time tracking of your platform's key performance indicators
              </p>
            </div>
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Real-Time Activity Monitor</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Live user engagement and session tracking
              </p>
            </div>
            <RealTimeUserActivity />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Advanced user management tools coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Oversight</CardTitle>
                <CardDescription>Monitor and manage platform courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Course management tools coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Platform configuration tools coming soon!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
