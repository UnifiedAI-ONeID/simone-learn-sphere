
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useMetricsDashboard } from '@/hooks/useMetricsDashboard';
import { LocalizedText } from '@/components/LocalizedText';

export const SystemMetrics = () => {
  const { metrics, loading } = useMetricsDashboard();

  // Mock system health data (in a real app, this would come from actual monitoring)
  const systemHealth = {
    cpu: 45,
    memory: 67,
    storage: 23,
    network: 89,
    database: 78,
    api: 92
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (value >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
            <LocalizedText text="System Metrics" />
          </h2>
          <p className="text-gray-600">
            <LocalizedText text="Monitor platform performance and health" />
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Activity className="h-3 w-3 mr-1" />
          <LocalizedText text="Live" />
        </Badge>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Avg Response Time" />
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Last 24 hours" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Concurrent Users" />
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.concurrentUsers}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Currently active" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Completion Rate" />
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.weeklyCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="This week" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <LocalizedText text="Total Users" />
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <LocalizedText text="Platform users" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              <LocalizedText text="CPU Usage" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current</span>
              <span className={`font-medium ${getHealthColor(systemHealth.cpu)}`}>
                {systemHealth.cpu}%
              </span>
            </div>
            <Progress value={systemHealth.cpu} className="w-full" />
            <Badge className={getHealthBadge(systemHealth.cpu)}>
              {systemHealth.cpu >= 80 ? 'High' : systemHealth.cpu >= 60 ? 'Normal' : 'Low'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <LocalizedText text="Memory Usage" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current</span>
              <span className={`font-medium ${getHealthColor(systemHealth.memory)}`}>
                {systemHealth.memory}%
              </span>
            </div>
            <Progress value={systemHealth.memory} className="w-full" />
            <Badge className={getHealthBadge(systemHealth.memory)}>
              {systemHealth.memory >= 80 ? 'High' : systemHealth.memory >= 60 ? 'Normal' : 'Low'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <LocalizedText text="Database Performance" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Performance</span>
              <span className={`font-medium ${getHealthColor(systemHealth.database)}`}>
                {systemHealth.database}%
              </span>
            </div>
            <Progress value={systemHealth.database} className="w-full" />
            <Badge className={getHealthBadge(systemHealth.database)}>
              {systemHealth.database >= 80 ? 'Optimal' : systemHealth.database >= 60 ? 'Good' : 'Poor'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              <LocalizedText text="Storage Usage" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Disk Usage</span>
              <span className={`font-medium ${getHealthColor(100 - systemHealth.storage)}`}>
                {systemHealth.storage}%
              </span>
            </div>
            <Progress value={systemHealth.storage} className="w-full" />
            <Badge className={getHealthBadge(100 - systemHealth.storage)}>
              {systemHealth.storage < 50 ? 'Available' : systemHealth.storage < 80 ? 'Normal' : 'High'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              <LocalizedText text="Network Status" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Quality</span>
              <span className={`font-medium ${getHealthColor(systemHealth.network)}`}>
                {systemHealth.network}%
              </span>
            </div>
            <Progress value={systemHealth.network} className="w-full" />
            <Badge className={getHealthBadge(systemHealth.network)}>
              {systemHealth.network >= 80 ? 'Excellent' : systemHealth.network >= 60 ? 'Good' : 'Poor'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              <LocalizedText text="API Health" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className={`font-medium ${getHealthColor(systemHealth.api)}`}>
                {systemHealth.api}%
              </span>
            </div>
            <Progress value={systemHealth.api} className="w-full" />
            <Badge className={getHealthBadge(systemHealth.api)}>
              {systemHealth.api >= 80 ? 'Healthy' : systemHealth.api >= 60 ? 'Warning' : 'Critical'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
