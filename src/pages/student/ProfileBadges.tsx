
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp,
  Zap
} from 'lucide-react';

export const ProfileBadges = () => {
  const badges = [
    {
      name: 'Course Explorer',
      description: 'Enrolled in your first course',
      icon: BookOpen,
      progress: 100,
      isCompleted: true
    },
    {
      name: 'Time Traveler',
      description: 'Spent 10 hours learning',
      icon: Clock,
      progress: 75,
      isCompleted: false
    },
    {
      name: 'Rising Star',
      description: 'Achieved a top 10% ranking',
      icon: Star,
      progress: 50,
      isCompleted: false
    },
    {
      name: 'Social Butterfly',
      description: 'Joined 5 learning groups',
      icon: Users,
      progress: 25,
      isCompleted: false
    },
    {
      name: 'Trendsetter',
      description: 'Completed a trending course',
      icon: TrendingUp,
      progress: 0,
      isCompleted: false
    },
    {
      name: 'Quiz Whiz',
      description: 'Aced 5 quizzes',
      icon: Award,
      progress: 60,
      isCompleted: false
    },
    {
      name: 'Completionist',
      description: 'Finished 3 courses',
      icon: Trophy,
      progress: 90,
      isCompleted: false
    },
    {
      name: 'Target Achiever',
      description: 'Set and met a learning goal',
      icon: Target,
      progress: 80,
      isCompleted: false
    },
    {
      name: 'Power Learner',
      description: 'Completed a course in one day',
      icon: Zap,
      progress: 40,
      isCompleted: false
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Your Profile Badges
        </h1>
        <p className="text-muted-foreground">
          Track your achievements and progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {badge.name}
              </CardTitle>
              {badge.isCompleted ? (
                <Badge variant="secondary">
                  Completed
                </Badge>
              ) : (
                <Badge variant="outline">
                  In Progress
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {badge.progress}%
              </div>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
              <Progress value={badge.progress} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
