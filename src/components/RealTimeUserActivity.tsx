
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Users, Eye } from 'lucide-react';

interface UserActivity {
  id: string;
  user_id: string;
  action_type: string;
  timestamp: string;
  metadata?: any;
}

interface ActiveSession {
  id: string;
  user_id: string;
  session_start: string;
  ip_address?: string;
}

export const RealTimeUserActivity = () => {
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch recent activities
        const { data: activities } = await supabase
          .from('user_engagement')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);

        // Fetch active sessions
        const { data: sessions } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('is_active', true)
          .order('session_start', { ascending: false });

        setRecentActivities(activities || []);
        setActiveSessions(sessions || []);
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up real-time subscriptions
    const engagementChannel = supabase
      .channel('engagement-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_engagement'
      }, (payload) => {
        setRecentActivities(prev => [payload.new as UserActivity, ...prev.slice(0, 9)]);
      })
      .subscribe();

    const sessionChannel = supabase
      .channel('session-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_sessions'
      }, () => {
        // Refetch active sessions when there's any change
        supabase
          .from('user_sessions')
          .select('*')
          .eq('is_active', true)
          .order('session_start', { ascending: false })
          .then(({ data }) => setActiveSessions(data || []));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(engagementChannel);
      supabase.removeChannel(sessionChannel);
    };
  }, []);

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'lesson_start':
      case 'lesson_complete':
        return '📚';
      case 'course_create':
        return '✨';
      case 'login':
        return '🔑';
      case 'logout':
        return '👋';
      case 'page_view':
        return '👁️';
      default:
        return '📊';
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'lesson_complete':
        return 'bg-green-100 text-green-800';
      case 'lesson_start':
        return 'bg-blue-100 text-blue-800';
      case 'course_create':
        return 'bg-purple-100 text-purple-800';
      case 'login':
        return 'bg-emerald-100 text-emerald-800';
      case 'logout':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardContent className="pt-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live User Activity</span>
            <Badge variant="secondary">{recentActivities.length}</Badge>
          </CardTitle>
          <CardDescription>Real-time user engagement events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getActivityIcon(activity.action_type)}</span>
                    <div>
                      <p className="font-medium text-sm">
                        {activity.action_type.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getActivityColor(activity.action_type)} variant="secondary">
                    {activity.action_type.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Active Sessions</span>
            <Badge variant="secondary">{activeSessions.length}</Badge>
          </CardTitle>
          <CardDescription>Currently active user sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activeSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active sessions</p>
            ) : (
              activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium text-sm">
                        User Session
                      </p>
                      <p className="text-xs text-gray-500">
                        Started: {new Date(session.session_start).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
