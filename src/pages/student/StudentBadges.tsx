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
  Shield, 
  Zap 
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const StudentBadges = () => {
  const badges = [
    {
      id: 'badge-1',
      name: 'Course Explorer',
      description: 'Enrolled in your first course',
      icon: BookOpen,
      progress: 100,
      isCompleted: true
    },
    {
      id: 'badge-2',
      name: 'Time Traveler',
      description: 'Spent 10 hours learning',
      icon: Clock,
      progress: 75,
      isCompleted: false
    },
    {
      id: 'badge-3',
      name: 'Social Learner',
      description: 'Joined a study group',
      icon: Users,
      progress: 50,
      isCompleted: false
    },
    {
      id: 'badge-4',
      name: 'Rising Star',
      description: 'Increased your learning streak',
      icon: TrendingUp,
      progress: 25,
      isCompleted: false
    },
    {
      id: 'badge-5',
      name: 'Quiz Master',
      description: 'Aced a quiz with a perfect score',
      icon: Award,
      progress: 0,
      isCompleted: false
    },
    {
      id: 'badge-6',
      name: 'Security Guardian',
      description: 'Completed a security course',
      icon: Shield,
      progress: 100,
      isCompleted: true
    },
    {
      id: 'badge-7',
      name: 'Speed Learner',
      description: 'Completed a course in under a week',
      icon: Zap,
      progress: 60,
      isCompleted: false
    },
    {
      id: 'badge-8',
      name: 'Completionist',
      description: 'Completed 5 courses',
      icon: Trophy,
      progress: 80,
      isCompleted: false
    },
    {
      id: 'badge-9',
      name: 'Goal Setter',
      description: 'Set a learning goal for the week',
      icon: Target,
      progress: 40,
      isCompleted: false
    },
    {
      id: 'badge-10',
      name: 'Star Student',
      description: 'Achieved a top score in a course',
      icon: Star,
      progress: 90,
      isCompleted: false
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="Your Badges" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Track your achievements and progress" />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {badge.isCompleted ? (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Award className="h-4 w-4 text-muted-foreground" />
                )}
                <UnifiedLocalizedText text={badge.name} />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text={badge.description} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={badge.progress} className="mb-2" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  <UnifiedLocalizedText text="Progress" />: {badge.progress}%
                </span>
                {badge.isCompleted ? (
                  <Badge variant="outline">
                    <UnifiedLocalizedText text="Completed" />
                  </Badge>
                ) : (
                  <span>
                    <UnifiedLocalizedText text="Keep going!" />
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
