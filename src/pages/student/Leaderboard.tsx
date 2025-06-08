
import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "Alex Chen", points: 2450, streak: 15, badge: "🏆" },
    { rank: 2, name: "Sarah Johnson", points: 2380, streak: 12, badge: "🥈" },
    { rank: 3, name: "Mike Rodriguez", points: 2290, streak: 10, badge: "🥉" },
    { rank: 4, name: "Emma Wilson", points: 2150, streak: 8, badge: "" },
    { rank: 5, name: "John Smith", points: 2090, streak: 7, badge: "" },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="Leaderboard" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="See how you rank among your peers" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">
                <LocalizedText text="Top Performers" />
              </h2>
              <div className="space-y-4">
                {leaderboardData.map((user) => (
                  <div key={user.rank} className={`flex items-center gap-4 p-4 rounded-lg border ${
                    user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent border-yellow-200' : ''
                  }`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {user.rank <= 3 ? user.badge : user.rank}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {user.points} points
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {user.streak} day streak
                        </span>
                      </div>
                    </div>
                    {user.rank <= 3 && (
                      <Badge variant="secondary" className="font-bold">
                        Top {user.rank}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Your Rank" />
              </h3>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">#12</span>
                </div>
                <p className="font-medium">1,890 points</p>
                <p className="text-sm text-muted-foreground">5 day streak</p>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Leaderboard Stats" />
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Participants</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Points</span>
                  <span className="font-medium">1,456</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Streak</span>
                  <span className="font-medium">28 days</span>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Achievements" />
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Medal className="h-4 w-4 text-yellow-500" />
                  <span>Consistent Learner</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span>Quiz Champion</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>Course Completer (locked)</span>
                </div>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
