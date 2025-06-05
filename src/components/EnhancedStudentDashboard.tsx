
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Flame, Clock, Target, PlayCircle, Award, TrendingUp } from 'lucide-react';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useGamification } from '@/hooks/useGamification';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const EnhancedStudentDashboard: React.FC = () => {
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { userBadges, streak, totalPoints, loading: gamificationLoading } = useGamification();

  const completedCourses = enrollments.filter(e => e.completed_at);
  const activeCourses = enrollments.filter(e => !e.completed_at);
  const averageProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length 
    : 0;

  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 1 },
    { day: 'Thu', hours: 4 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 3 },
  ];

  const recentBadges = userBadges.slice(0, 3);

  if (enrollmentsLoading || gamificationLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 🎓</h1>
            <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{streak?.current_streak || 0}</div>
            <div className="text-blue-100">day streak</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed Courses</p>
                <p className="text-3xl font-bold text-green-700">{completedCourses.length}</p>
              </div>
              <Trophy className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-blue-700">{activeCourses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Learning Streak</p>
                <p className="text-3xl font-bold text-orange-700">{streak?.current_streak || 0}</p>
              </div>
              <Flame className="w-12 h-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold text-purple-700">{totalPoints}</p>
              </div>
              <Award className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              Continue Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCourses.length > 0 ? (
              activeCourses.slice(0, 3).map(enrollment => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={enrollment.course?.thumbnail_url || '/placeholder.svg'}
                      alt={enrollment.course?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{enrollment.course?.title}</h4>
                      <p className="text-sm text-gray-600">
                        {enrollment.course?.estimated_duration}h • {enrollment.course?.difficulty_level}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={enrollment.progress_percentage} className="w-32" />
                        <span className="text-xs text-gray-500">{enrollment.progress_percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">Continue</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active courses. Explore our catalog to start learning!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBadges.length > 0 ? (
              recentBadges.map(badge => (
                <div key={badge.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{badge.name}</p>
                    <p className="text-xs text-gray-600">{badge.points} points</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No badges earned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Weekly Learning Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${averageProgress}, 100`}
                  />
                  <text x="18" y="20.35" className="fill-current text-xl font-bold text-gray-700" textAnchor="middle">
                    {Math.round(averageProgress)}%
                  </text>
                </svg>
              </div>
              <p className="text-gray-600">Average Progress</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Courses</span>
                <span className="font-medium">{completedCourses.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Enrollments</span>
                <span className="font-medium">{enrollments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium">
                  {enrollments.length > 0 ? Math.round((completedCourses.length / enrollments.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
