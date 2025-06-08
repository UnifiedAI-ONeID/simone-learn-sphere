
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const AIAuditTrail = () => {
  const auditLogs = [
    {
      id: 1,
      user: "john.doe@example.com",
      action: "AI_TUTOR_QUERY",
      details: "Asked question about React hooks",
      timestamp: "2024-06-08 14:30:25",
      severity: "normal",
      flagged: false
    },
    {
      id: 2,
      user: "suspicious.user@example.com",
      action: "BULK_AI_REQUESTS",
      details: "Made 50+ requests in 1 minute",
      timestamp: "2024-06-08 14:25:10",
      severity: "high",
      flagged: true
    },
    {
      id: 3,
      user: "student123@example.com",
      action: "AI_CONTENT_GENERATION",
      details: "Generated quiz answers",
      timestamp: "2024-06-08 14:20:15",
      severity: "medium",
      flagged: true
    }
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="AI Audit Trail" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Monitor AI usage patterns and detect potential abuse" />
          </p>
        </div>

        <PlatformCard className="mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="AI_TUTOR_QUERY">Tutor Queries</SelectItem>
                <SelectItem value="AI_CONTENT_GENERATION">Content Gen</SelectItem>
                <SelectItem value="BULK_AI_REQUESTS">Bulk Requests</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <LocalizedText text="Filter" />
            </Button>
          </div>
        </PlatformCard>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">23</p>
              <p className="text-sm text-muted-foreground">High Severity</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">156</p>
              <p className="text-sm text-muted-foreground">Medium Severity</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">2,847</p>
              <p className="text-sm text-muted-foreground">Normal Activity</p>
            </div>
          </PlatformCard>
          <PlatformCard>
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Users Flagged</p>
            </div>
          </PlatformCard>
        </div>

        <PlatformCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Timestamp</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Action</th>
                  <th className="text-left p-4">Details</th>
                  <th className="text-left p-4">Severity</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm text-muted-foreground">
                      {log.timestamp}
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{log.user}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {log.details}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(log.severity)}
                        <Badge className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={log.flagged ? 'destructive' : 'secondary'}>
                        {log.flagged ? 'Flagged' : 'Normal'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <LocalizedText text="View" />
                        </Button>
                        {log.flagged && (
                          <Button size="sm" variant="destructive">
                            <LocalizedText text="Take Action" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
