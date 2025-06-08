import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle,
  School,
  UserCheck,
  GraduationCap,
  Activity,
  DollarSign,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

export const AdminDashboardContent = () => {
  const { analytics } = useAdminAnalytics();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <UnifiedLocalizedText text="Total Users" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="All registered users" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 12% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <UnifiedLocalizedText text="Total Courses" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="All available courses" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalCourses || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 8% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            <UnifiedLocalizedText text="Active Students" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Students actively learning" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.activeStudents || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 15% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            <UnifiedLocalizedText text="Verified Educators" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Educators with verified profiles" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.verifiedEducators || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 5% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            <UnifiedLocalizedText text="Completed Courses" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Courses successfully completed" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.completedCourses || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 20% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <UnifiedLocalizedText text="Active Sessions" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Current active learning sessions" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.activeSessions || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 10% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <UnifiedLocalizedText text="Total Revenue" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Revenue generated from courses" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics?.totalRevenue || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 25% this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <UnifiedLocalizedText text="Avg. Session Time" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Average learning session duration" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.averageSessionTime || 0} mins</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 5 mins this month" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <UnifiedLocalizedText text="Security Alerts" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Potential security threats" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.securityAlerts || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Check security logs" />
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <UnifiedLocalizedText text="AI Interactions" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Total AI assistant interactions" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.aiInteractions || 0}</div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              <UnifiedLocalizedText text="Increased by 30% this month" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
