
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Shield, Activity, AlertTriangle, Settings, Database } from 'lucide-react';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { LocalizedText } from '@/components/LocalizedText';

export const MobileAdminDashboard = () => {
  const { trackPageView } = useEngagementTracking();
  useSessionTracking();

  useEffect(() => {
    trackPageView('mobile_admin_dashboard');
  }, [trackPageView]);

  return (
    <div className="p-4 space-y-4">
      {/* Critical Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-700">
                <LocalizedText text="2 Security Alerts" />
              </p>
              <p className="text-xs text-red-600">
                <LocalizedText text="Requires immediate attention" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">
                  <LocalizedText text="Total Users" />
                </p>
                <p className="text-lg font-semibold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">
                  <LocalizedText text="Active Now" />
                </p>
                <p className="text-lg font-semibold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <LocalizedText text="Quick Actions" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            <LocalizedText text="Manage Users" />
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            <LocalizedText text="Security Center" />
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Database className="h-4 w-4 mr-2" />
            <LocalizedText text="System Health" />
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            <LocalizedText text="Platform Settings" />
          </Button>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <LocalizedText text="System Status" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">API Services</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">Online</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Database</p>
              <p className="text-xs text-gray-500">High load detected</p>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Warning</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-sm">CDN</p>
              <p className="text-xs text-gray-500">Performance optimal</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Optimal</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
