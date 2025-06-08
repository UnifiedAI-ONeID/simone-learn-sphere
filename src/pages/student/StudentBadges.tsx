
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, ArrowLeft, Target, Zap, BookOpen, Users } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudentBadges = () => {
  const navigate = useNavigate();

  const earnedBadges = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      earnedAt: '2 days ago',
      rarity: 'Common'
    },
    {
      id: 2,
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      earnedAt: 'Today',
      rarity: 'Uncommon'
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Score 90%+ on 5 quizzes',
      icon: '🧠',
      earnedAt: '1 week ago',
      rarity: 'Rare'
    }
  ];

  const availableBadges = [
    {
      id: 4,
      name: 'Course Crusher',
      description: 'Complete your first course',
      icon: '🏆',
      progress: 75,
      requirement: 'Complete 1 course',
      rarity: 'Uncommon'
    },
    {
      id: 5,
      name: 'Speed Learner',
      description: 'Complete 3 lessons in one day',
      icon: '⚡',
      progress: 33,
      requirement: 'Complete 3 lessons in 24 hours',
      rarity: 'Rare'
    },
    {
      id: 6,
      name: 'Community Helper',
      description: 'Help 10 fellow students',
      icon: '🤝',
      progress: 20,
      requirement: 'Answer 10 forum questions',
      rarity: 'Epic'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'Uncommon': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
      case 'Rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'Epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200';
      case 'Legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/student/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <LocalizedText text="Badges & Achievements" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Track your learning milestones and unlock new achievements" />
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-sm text-muted-foreground">Total Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-sm text-muted-foreground">Rare Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">75%</div>
            <p className="text-sm text-muted-foreground">Collection Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          <LocalizedText text="Earned Badges" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedBadges.map((badge) => (
            <Card key={badge.id} className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="text-center">
                <div className="text-6xl mb-2">{badge.icon}</div>
                <CardTitle className="text-lg">{badge.name}</CardTitle>
                <CardDescription>{badge.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <Badge className={getRarityColor(badge.rarity)}>
                  {badge.rarity}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Earned {badge.earnedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Available Badges */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          <LocalizedText text="Available Badges" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableBadges.map((badge) => (
            <Card key={badge.id} className="bg-card text-card-foreground">
              <CardHeader className="text-center">
                <div className="text-6xl mb-2 opacity-50">{badge.icon}</div>
                <CardTitle className="text-lg">{badge.name}</CardTitle>
                <CardDescription>{badge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{badge.progress}%</span>
                  </div>
                  <Progress value={badge.progress} />
                </div>
                
                <div className="text-center space-y-2">
                  <Badge variant="outline" className={getRarityColor(badge.rarity)}>
                    {badge.rarity}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {badge.requirement}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          <LocalizedText text="Quick Actions" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/student/leaderboard')}>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1">View Leaderboard</h3>
              <p className="text-sm text-muted-foreground">See how you rank</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/student/courses')}>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Continue Learning</h3>
              <p className="text-sm text-muted-foreground">Earn more badges</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/student/forums')}>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Join Community</h3>
              <p className="text-sm text-muted-foreground">Help others learn</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
