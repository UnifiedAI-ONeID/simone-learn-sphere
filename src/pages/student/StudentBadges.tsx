import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Star, Target, Calendar, Lock } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const StudentBadges = () => {
  const earnedBadges = [
    { id: 1, name: "First Steps", description: "Completed first lesson", icon: Star, color: "bg-yellow-500", date: "2024-06-01" },
    { id: 2, name: "Quiz Master", description: "Scored 100% on a quiz", icon: Trophy, color: "bg-blue-500", date: "2024-06-05" },
    { id: 3, name: "Streak Keeper", description: "7-day learning streak", icon: Target, color: "bg-orange-500", date: "2024-06-10" },
  ];

  const availableBadges = [
    { id: 4, name: "Course Completer", description: "Complete your first course", icon: Award, progress: 65 },
    { id: 5, name: "Social Butterfly", description: "Join 3 study groups", icon: Users, progress: 33 },
    { id: 6, name: "Monthly Champion", description: "Top performer this month", icon: Calendar, progress: 80 },
    { id: 7, name: "Security Star", description: "Enable 2FA", icon: Lock, progress: 0 },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <UnifiedLocalizedText text="Your Badges & Achievements" />
          </h1>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Track your learning milestones and unlock new achievements" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">
                <UnifiedLocalizedText text="Earned Badges" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-r from-accent/20 to-transparent">
                    <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-white`}>
                      <badge.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        <UnifiedLocalizedText text={badge.name} />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        <UnifiedLocalizedText text={badge.description} />
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        <UnifiedLocalizedText text="Earned" /> {badge.date}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </PlatformCard>

            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">
                <UnifiedLocalizedText text="Available Badges" />
              </h2>
              <div className="space-y-4">
                {availableBadges.map((badge) => (
                  <div key={badge.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <badge.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        <UnifiedLocalizedText text={badge.name} />
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <UnifiedLocalizedText text={badge.description} />
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <UnifiedLocalizedText text="Progress" />
                          <span>{badge.progress}%</span>
                        </div>
                        <Progress value={badge.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Badge Stats" />
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <UnifiedLocalizedText text="Total Badges" />
                  <span className="text-sm font-medium">3/7</span>
                </div>
                <div className="flex justify-between">
                  <UnifiedLocalizedText text="Points Earned" />
                  <span className="text-sm font-medium">150</span>
                </div>
                <div className="flex justify-between">
                  <UnifiedLocalizedText text="Completion Rate" />
                  <span className="text-sm font-medium">43%</span>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Next Milestone" />
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-medium mb-2">
                  <UnifiedLocalizedText text="Course Completer" />
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  <UnifiedLocalizedText text="35% remaining" />
                </p>
                <Progress value={65} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  <UnifiedLocalizedText text="Complete 3 more lessons" />
                </p>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
