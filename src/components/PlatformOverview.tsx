
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  GraduationCap,
  TrendingUp,
  Brain,
  Zap,
  Globe,
  Award,
  Clock,
  Star,
  Activity,
  BarChart3,
  Shield
} from 'lucide-react';

interface PlatformOverviewProps {
  totalUsers: number;
  activeCourses: number;
  completionRate: number;
  aiUsage: number;
  userEngagement: number;
  securityScore: number;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({
  totalUsers,
  activeCourses,
  completionRate,
  aiUsage,
  userEngagement,
  securityScore
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Users */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Total Users
          </CardTitle>
          <CardDescription>
            All registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalUsers}</div>
          <div className="text-sm text-gray-500">
            Since last month: +12%
          </div>
        </CardContent>
      </Card>

      {/* Active Courses */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-500" />
            Active Courses
          </CardTitle>
          <CardDescription>
            Courses currently in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeCourses}</div>
          <div className="text-sm text-gray-500">
            New courses this month: +5
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-yellow-500" />
            Completion Rate
          </CardTitle>
          <CardDescription>
            Percentage of completed courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* AI Usage */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            AI Usage
          </CardTitle>
          <CardDescription>
            How often AI tools are used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{aiUsage}%</div>
          <div className="text-sm text-gray-500">
            Increased AI interactions: +25%
          </div>
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            User Engagement
          </CardTitle>
          <CardDescription>
            Active users and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{userEngagement}</div>
          <div className="text-sm text-gray-500">
            Daily active users: +8%
          </div>
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            Security Score
          </CardTitle>
          <CardDescription>
            Overall platform security rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{securityScore}/100</div>
          <div className="text-sm text-gray-500">
            Threats neutralized: +3
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
