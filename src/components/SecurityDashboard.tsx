
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { Shield, AlertTriangle, Users, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SecurityDashboard = () => {
  const { auditLogs, loading, refreshAuditLogs } = useSecurityAudit();

  const getEventBadgeColor = (eventType: string) => {
    switch (eventType) {
      case 'role_change':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'failed_login':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'successful_login':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'role_change':
        return <Users className="h-4 w-4" />;
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Monitor security events and audit logs</p>
        </div>
        <Button
          onClick={refreshAuditLogs}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Latest security audit logs and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Loading audit logs...</p>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">No security events recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getEventBadgeColor(event.event_type)}>
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>User ID: {event.user_id || 'Anonymous'}</p>
                      {event.event_details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                            View Details
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.event_details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
