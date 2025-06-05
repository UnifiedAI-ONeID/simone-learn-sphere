
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Clock, Eye, Lock, Zap } from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';
import { useImpersonationSecurity } from '@/hooks/useImpersonationSecurity';
import { TranslatedText } from '@/components/TranslatedText';

export const EnhancedSecurityDashboard = () => {
  const { auditLogs, loading, refreshAuditLogs } = useSecurityAudit();
  const { securityState: sessionSecurity } = useEnhancedSessionSecurity();
  const { securityState: impersonationSecurity } = useImpersonationSecurity();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'audit'>('overview');

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'successful_login':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'impersonation_started':
        return <Eye className="h-4 w-4 text-orange-600" />;
      case 'impersonation_ended':
        return <Lock className="h-4 w-4 text-blue-600" />;
      default:
        return <Zap className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSecurityLevel = () => {
    let score = 100;
    let issues: string[] = [];

    if (!sessionSecurity.isSessionValid) {
      score -= 30;
      issues.push('Invalid session detected');
    }

    if (sessionSecurity.securityThreats.length > 0) {
      score -= sessionSecurity.securityThreats.length * 15;
      issues.push(`${sessionSecurity.securityThreats.length} security threats`);
    }

    if (impersonationSecurity.activeSession && impersonationSecurity.securityWarnings.length > 0) {
      score -= 20;
      issues.push('Impersonation security warnings');
    }

    return { score: Math.max(0, score), issues };
  };

  const { score, issues } = getSecurityLevel();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          <TranslatedText text="Enhanced Security Dashboard" />
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          <TranslatedText text="Real-time security monitoring and threat detection" />
        </p>
      </div>

      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <TranslatedText text="Security Score" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(score)}`}>
                {score}/100
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  <TranslatedText text="Current Security Level" />
                </p>
                {issues.length > 0 ? (
                  <ul className="text-sm text-red-600 dark:text-red-400">
                    {issues.map((issue, index) => (
                      <li key={index}>• <TranslatedText text={issue} /></li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    <TranslatedText text="All security checks passed" />
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'sessions', label: 'Session Security' },
          { key: 'audit', label: 'Audit Logs' }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.key as any)}
          >
            <TranslatedText text={tab.label} />
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Session Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <TranslatedText text="Session Security" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span><TranslatedText text="Session Valid" /></span>
                  <Badge variant={sessionSecurity.isSessionValid ? "default" : "destructive"}>
                    <TranslatedText text={sessionSecurity.isSessionValid ? "Valid" : "Invalid"} />
                  </Badge>
                </div>
                {sessionSecurity.sessionWarning && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <TranslatedText text="Session expiring soon" />
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Impersonation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <TranslatedText text="Impersonation Status" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span><TranslatedText text="Active Session" /></span>
                  <Badge variant={impersonationSecurity.activeSession ? "secondary" : "outline"}>
                    <TranslatedText text={impersonationSecurity.activeSession ? "Active" : "None"} />
                  </Badge>
                </div>
                {impersonationSecurity.activeSession && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p><TranslatedText text="Target" />: {impersonationSecurity.sessionDetails.targetUser}</p>
                    <p><TranslatedText text="Time Remaining" />: {Math.ceil(impersonationSecurity.sessionTimeRemaining / (60 * 1000))} <TranslatedText text="minutes" /></p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <CardTitle><TranslatedText text="Session Security Details" /></CardTitle>
            <CardDescription>
              <TranslatedText text="Detailed information about current session security" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionSecurity.securityThreats.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium"><TranslatedText text="Security Threats Detected" /></p>
                  <ul className="mt-2 space-y-1">
                    {sessionSecurity.securityThreats.map((threat, index) => (
                      <li key={index} className="text-sm">
                        • <TranslatedText text={threat} />
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {impersonationSecurity.securityWarnings.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium"><TranslatedText text="Impersonation Warnings" /></p>
                  <ul className="mt-2 space-y-1">
                    {impersonationSecurity.securityWarnings.map((warning, index) => (
                      <li key={index} className="text-sm">
                        • <TranslatedText text={warning} />
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {sessionSecurity.securityThreats.length === 0 && impersonationSecurity.securityWarnings.length === 0 && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-green-600 font-medium">
                  <TranslatedText text="No security issues detected" />
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span><TranslatedText text="Security Audit Logs" /></span>
              <Button onClick={refreshAuditLogs} disabled={loading}>
                <TranslatedText text="Refresh" />
              </Button>
            </CardTitle>
            <CardDescription>
              <TranslatedText text="Recent security events and activities" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2"><TranslatedText text="Loading audit logs..." /></p>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  <TranslatedText text="No audit logs found" />
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditLogs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    {getEventIcon(log.event_type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          <TranslatedText text={log.event_type.replace(/_/g, ' ')} />
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.event_details && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {Object.entries(log.event_details as any).map(([key, value]) => (
                            <div key={key}>
                              <span className="capitalize">{key.replace(/_/g, ' ')}</span>: {String(value)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
