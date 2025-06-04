
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMetricsDashboard } from '@/hooks/useMetricsDashboard';
import { 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Activity,
  Target,
  GraduationCap,
  Zap
} from 'lucide-react';

export const MetricsDashboard = () => {
  const { metrics, loading } = useMetricsDashboard();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusBadge = (value: number, target: number, isReverse = false) => {
    const ratio = isReverse ? target / value : value / target;
    if (ratio >= 1) return <Badge className="bg-green-500">Target Met</Badge>;
    if (ratio >= 0.8) return <Badge className="bg-yellow-500">Close</Badge>;
    return <Badge variant="destructive">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(1)}ms</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</p>
                </div>
              </div>
              {getStatusBadge(metrics.averageResponseTime, 5, true)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: Sub-5ms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.concurrentUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Concurrent Users</p>
                </div>
              </div>
              {getStatusBadge(metrics.concurrentUsers, 10000)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: 10,000 users</p>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.weeklyCompletionRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Weekly Completion</p>
                </div>
              </div>
              {getStatusBadge(metrics.weeklyCompletionRate, 90)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: ≥90%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{metrics.educatorCreationRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Educator Creation</p>
                </div>
              </div>
              {getStatusBadge(metrics.educatorCreationRate, 50)}
            </div>
            <p className="text-xs text-gray-500 mt-2">Target: {'>'}50% quarterly</p>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalCourses.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalLessons.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Lessons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">Live</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Real-time Updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics Overview</CardTitle>
          <CardDescription>
            Track progress toward your ambitious platform goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Performance Goals</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.averageResponseTime.toFixed(1)}ms / 5ms</span>
                    {getStatusBadge(metrics.averageResponseTime, 5, true)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Concurrent Users</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.concurrentUsers.toLocaleString()} / 10,000</span>
                    {getStatusBadge(metrics.concurrentUsers, 10000)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Engagement Goals</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Weekly Completion Rate</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.weeklyCompletionRate.toFixed(1)}% / 90%</span>
                    {getStatusBadge(metrics.weeklyCompletionRate, 90)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Educator Creation Rate</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{metrics.educatorCreationRate.toFixed(1)}% / 50%</span>
                    {getStatusBadge(metrics.educatorCreationRate, 50)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
