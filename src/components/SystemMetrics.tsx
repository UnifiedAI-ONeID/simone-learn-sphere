
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ComponentType<{ className?: string }>;
}

export const SystemMetrics = () => {
  const metrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 23,
      unit: '%',
      status: 'healthy',
      icon: Cpu
    },
    {
      name: 'Memory Usage',
      value: 67,
      unit: '%',
      status: 'warning',
      icon: BarChart3
    },
    {
      name: 'Disk Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      icon: HardDrive
    },
    {
      name: 'Network I/O',
      value: 12,
      unit: 'MB/s',
      status: 'healthy',
      icon: Wifi
    },
    {
      name: 'Database Connections',
      value: 156,
      unit: 'active',
      status: 'healthy',
      icon: Database
    },
    {
      name: 'Response Time',
      value: 125,
      unit: 'ms',
      status: 'healthy',
      icon: Activity
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProgressValue = (metric: SystemMetric) => {
    if (metric.name === 'Response Time') {
      return Math.min((metric.value / 500) * 100, 100);
    }
    if (metric.name === 'Database Connections') {
      return Math.min((metric.value / 200) * 100, 100);
    }
    return metric.value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            <UnifiedLocalizedText text="System Metrics" />
          </h2>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Real-time system performance monitoring" />
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <UnifiedLocalizedText text="Live" />
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <UnifiedLocalizedText text={metric.name} />
                </CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value}{metric.unit}
                </div>
                <div className="mt-2">
                  <Progress 
                    value={getProgressValue(metric)} 
                    className="w-full h-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 capitalize">
                  <UnifiedLocalizedText text={metric.status} />
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <UnifiedLocalizedText text="System Overview" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Overall system health and status" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">98.5%</div>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Uptime" />
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,847</div>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Active Users" />
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">23ms</div>
              <p className="text-sm text-muted-foreground">
                <UnifiedLocalizedText text="Avg Response" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
