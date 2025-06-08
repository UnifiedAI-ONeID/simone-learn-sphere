
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Clock, CheckCircle, X, Eye } from 'lucide-react';
import { useEnhancedSecurityMonitoring } from '@/hooks/useEnhancedSecurityMonitoring';
import { LocalizedText } from '@/components/LocalizedText';

export const EnhancedSecurityAlert = () => {
  const { securityState, resolveSecurityAlert, loading } = useEnhancedSecurityMonitoring();
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50 w-96">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-800 dark:text-blue-200">
                <LocalizedText text="Checking security status..." />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (securityState.alerts.length === 0 && securityState.threatLevel === 'low') {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <Eye className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
      {/* Threat level indicator */}
      {securityState.threatLevel !== 'low' && (
        <Alert className={getSeverityColor(securityState.threatLevel)}>
          {getSeverityIcon(securityState.threatLevel)}
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                <LocalizedText text="Security Threat Level" />
              </p>
              <p className="text-sm">
                <Badge variant="secondary" className="capitalize">
                  {securityState.threatLevel}
                </Badge>
                <span className="ml-2">
                  <LocalizedText text={`${securityState.alerts.length} active alerts`} />
                </span>
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Individual security alerts */}
      {securityState.alerts.slice(0, 3).map((alert) => (
        <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
          {getSeverityIcon(alert.severity)}
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">
                  <LocalizedText text={alert.alert_type.replace(/_/g, ' ')} />
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedAlert(
                      expandedAlert === alert.id ? null : alert.id
                    )}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => resolveSecurityAlert(alert.id)}
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {expandedAlert === alert.id && alert.alert_details && (
                <div className="text-xs bg-white/50 dark:bg-gray-800/50 p-2 rounded">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(alert.alert_details, null, 2)}
                  </pre>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <span>
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(alert.created_at).toLocaleTimeString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {alert.severity}
                </Badge>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}

      {/* Show more alerts indicator */}
      {securityState.alerts.length > 3 && (
        <Card className="border-gray-200 bg-gray-50 dark:bg-gray-900/50">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              <LocalizedText text={`+${securityState.alerts.length - 3} more security alerts`} />
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
