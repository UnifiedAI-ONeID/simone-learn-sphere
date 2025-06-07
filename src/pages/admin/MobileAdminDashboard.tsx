
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Activity, AlertTriangle } from 'lucide-react';
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
                  <LocalizedText text="Active Users" />
                </p>
                <p className="text-lg font-semibold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">
                  <LocalizedText text="Security Score" />
                </p>
                <p className="text-lg font-semibold">95%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <LocalizedText text="System Status" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">API Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <LocalizedText text="Healthy" />
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Database</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <LocalizedText text="Operational" />
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">CDN</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              <LocalizedText text="Degraded" />
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
