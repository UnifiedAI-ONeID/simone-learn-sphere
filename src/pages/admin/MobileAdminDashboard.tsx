
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, BarChart3, Settings, DollarSign, Flag, Brain, Eye, AlertTriangle } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileAdminDashboard = () => {
  const navigate = useNavigate();
  const { trackPageView } = useEngagementTracking();
  const [activeTab, setActiveTab] = useState('overview');
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_admin_dashboard');
  }, [trackPageView]);

  // Real data would come from API calls
  const stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingReports: 0
  };

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="overview" className="text-xs">
            <LocalizedText text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs">
            <LocalizedText text="Users" />
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <LocalizedText text="Security" />
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs">
            <LocalizedText text="System" />
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs">
            <LocalizedText text="Content" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Total Users" />
                    </p>
                    <p className="text-lg font-semibold">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">
                      <LocalizedText text="Active Users" />
                    </p>
                    <p className="text-lg font-semibold">{stats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <LocalizedText text="Quick Actions" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Users" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="View Analytics" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Review Reports" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                <LocalizedText text="Platform Revenue" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  <LocalizedText text="No revenue data yet" />
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <LocalizedText text="Revenue will appear as users enroll in courses" />
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="User Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="View All Users" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/users?role=educator')}
              >
                <Eye className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Educators" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/users?role=student')}
              >
                <Users className="h-4 w-4 mr-2" />
                <LocalizedText text="Manage Students" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Center" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/ai-logs')}
              >
                <Brain className="h-4 w-4 mr-2" />
                <LocalizedText text="AI Audit Trail" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Reports" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Security Settings" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="System Management" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                <LocalizedText text="Platform Settings" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                <LocalizedText text="System Analytics" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/payouts')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                <LocalizedText text="Payment Management" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Content Moderation" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/reports')}
              >
                <Flag className="h-4 w-4 mr-2" />
                <LocalizedText text="Review Reports" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
              >
                <Eye className="h-4 w-4 mr-2" />
                <LocalizedText text="Content Analytics" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
