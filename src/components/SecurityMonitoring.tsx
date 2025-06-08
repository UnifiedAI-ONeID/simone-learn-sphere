
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  UserCheck, 
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { LocalizedText } from '@/components/LocalizedText';

export const SecurityMonitoring = () => {
  const { auditLogs, loading, refreshAuditLogs } = useSecurityAudit();
  const securityState = useSecurityMonitor();

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_attempt':
        return <UserCheck className="h-4 w-4" />;
      case 'security_threat_detected':
        return <AlertTriangle className="h-4 w-4" />;
      case 'impersonation_started':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            <LocalizedText text="Security Monitoring" />
          </h2>
          <p className="text-gray-600">
            <LocalizedText text="Monitor security events and threats" />
          </p>
        </div>
        <Button onClick={refreshAuditLogs} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          <LocalizedText text="Refresh" />
        </Button>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Threat Level" />
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getThreatLevelColor(securityState.threatLevel)}>
                {securityState.threatLevel.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <LocalizedText text="Current security status" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Active Threats" />
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityState.activeThreats.length}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Detected threats" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Security Events" />
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Recent events" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Last Check" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {securityState.lastSecurityCheck.toLocaleTimeString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Security scan time" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Threats */}
      {securityState.activeThreats.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <LocalizedText text="Active Security Threats" />
            </CardTitle>
            <CardDescription className="text-red-600">
              <LocalizedText text="Immediate attention required" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityState.activeThreats.map((threat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-800">{threat}</span>
                  </div>
                  <Badge variant="destructive">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <LocalizedText text="Security Audit Log" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Recent security events and activities" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                <LocalizedText text="No security events recorded" />
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditLogs.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getEventTypeIcon(event.event_type)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.event_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.ip_address && `IP: ${event.ip_address}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <LocalizedText text="Security Recommendations" />
          </CardTitle>
          <CardDescription>
            <LocalizedText text="Suggested actions to improve security" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Lock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium text-blue-800">
                  <LocalizedText text="Enable Two-Factor Authentication" />
                </p>
                <p className="text-sm text-blue-600">
                  <LocalizedText text="Strengthen account security for all admin users" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium text-green-800">
                  <LocalizedText text="Regular Security Audits" />
                </p>
                <p className="text-sm text-green-600">
                  <LocalizedText text="Schedule automated security scans weekly" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-800">
                  <LocalizedText text="Monitor Failed Login Attempts" />
                </p>
                <p className="text-sm text-yellow-600">
                  <LocalizedText text="Set up alerts for suspicious login patterns" />
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
