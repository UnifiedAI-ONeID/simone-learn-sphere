import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye,
  Activity,
  Clock,
  Zap,
  Globe,
  Users,
  Database,
  Wifi,
  Settings,
  RefreshCw,
  Bell
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'login' | 'access' | 'data_change' | 'threat';
  description: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  user?: string;
}

export const SecurityMonitoring = () => {
  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      timestamp: '2024-06-08T14:30:00Z',
      type: 'login',
      description: 'Successful login from new device',
      severity: 'low',
      location: 'New York, USA',
      user: 'john.doe@example.com'
    },
    {
      id: '2',
      timestamp: '2024-06-08T15:45:00Z',
      type: 'access',
      description: 'User accessed sensitive data',
      severity: 'medium',
      user: 'jane.doe@example.com'
    },
    {
      id: '3',
      timestamp: '2024-06-08T16:20:00Z',
      type: 'threat',
      description: 'Potential SQL injection attempt',
      severity: 'high'
    },
    {
      id: '4',
      timestamp: '2024-06-08T17:00:00Z',
      type: 'data_change',
      description: 'Admin settings modified',
      severity: 'medium',
      user: 'admin@example.com'
    },
    {
      id: '5',
      timestamp: '2024-06-08T18:10:00Z',
      type: 'login',
      description: 'Login failed due to invalid credentials',
      severity: 'low',
      location: 'Remote'
    }
  ];

  const severityCounts = securityEvents.reduce(
    (acc, event) => {
      acc[event.severity] += 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const totalEvents = securityEvents.length;

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-orange-500';
      case 'high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <UnifiedLocalizedText text="Security Monitoring" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Real-time monitoring of security events and system health" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    <UnifiedLocalizedText text="Low Risk Events" />
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-800">{severityCounts.low}</span>
                <span className="text-sm text-green-700">
                  <UnifiedLocalizedText text="Recent low-risk activity" />
                </span>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">
                    <UnifiedLocalizedText text="Medium Risk Events" />
                  </span>
                </div>
                <span className="text-2xl font-bold text-orange-800">{severityCounts.medium}</span>
                <span className="text-sm text-orange-700">
                  <UnifiedLocalizedText text="Potential security concerns" />
                </span>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">
                    <UnifiedLocalizedText text="High Risk Events" />
                  </span>
                </div>
                <span className="text-2xl font-bold text-red-800">{severityCounts.high}</span>
                <span className="text-sm text-red-700">
                  <UnifiedLocalizedText text="Immediate action required" />
                </span>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                <UnifiedLocalizedText text="Recent Security Events" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Detailed log of recent security-related activity" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityEvents.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <UnifiedLocalizedText text="No security events to display." />
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {securityEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {event.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className={`h-4 w-4 ${getSeverityColor(event.severity)}`} />
                          <span className="text-sm">
                            <UnifiedLocalizedText text={event.description} />
                          </span>
                        </div>
                        {event.user && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {event.user}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline">
                        <UnifiedLocalizedText text={event.type} />
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Refresh Events" />
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              <UnifiedLocalizedText text="Security Settings" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
