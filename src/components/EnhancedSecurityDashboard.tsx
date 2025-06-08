
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Clock, Eye, Lock, Zap } from 'lucide-react';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useEnhancedSessionSecurity } from '@/hooks/useEnhancedSessionSecurity';

export const EnhancedSecurityDashboard = () => {
  const { securityState } = useEnhancedSessionSecurity();
  const [isAuditing, setIsAuditing] = useState(false);

  const handleSecurityAudit = async () => {
    setIsAuditing(true);
    // Simulate security audit
    setTimeout(() => {
      setIsAuditing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Enhanced Security Dashboard
          </CardTitle>
          <CardDescription>
            Advanced security monitoring and threat detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">
                  Session Status
                </span>
              </div>
              <Badge variant={securityState.sessionWarning ? "destructive" : "default"}>
                {securityState.sessionWarning ? "Warning" : "Active"}
              </Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  Threats Detected
                </span>
              </div>
              <span className="text-2xl font-bold">{securityState.securityThreats.length}</span>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">
                  Monitoring
                </span>
              </div>
              <Badge variant="default">
                Active
              </Badge>
            </div>
          </div>

          <Button 
            onClick={handleSecurityAudit}
            disabled={isAuditing}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isAuditing ? "Running Security Audit..." : "Run Security Audit"}
          </Button>

          {securityState.securityThreats.length > 0 && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-semibold">
                    Security Issues Detected:
                  </p>
                  <ul className="list-disc pl-5">
                    {securityState.securityThreats.map((threat, index) => (
                      <li key={index}>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
