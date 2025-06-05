
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned_at?: string;
}

export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('points', { ascending: true });

      if (error) throw error;
      setBadges(data || []);
    } catch (err: any) {
      console.error('Error fetching badges:', err);
    }
  };

  const fetchUserBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      const userBadgesData = (data || []).map(item => ({
        ...item.badge,
        earned_at: item.earned_at,
      }));

      setUserBadges(userBadgesData);
      
      // Calculate total points
      const points = userBadgesData.reduce((sum, badge) => sum + (badge.points || 0), 0);
      setTotalPoints(points);
    } catch (err: any) {
      console.error('Error fetching user badges:', err);
    }
  };

  const fetchUserStreak = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setStreak(data || { current_streak: 0, longest_streak: 0, last_activity_date: '' });
    } catch (err: any) {
      console.error('Error fetching user streak:', err);
    }
  };

  const updateStreak = async () => {
    if (!user) return;

    try {
      await supabase.rpc('update_user_streak', { user_id: user.id });
      await fetchUserStreak();
    } catch (err: any) {
      console.error('Error updating streak:', err);
    }
  };

  const checkAndAwardBadges = async () => {
    if (!user) return;

    try {
      const previousBadgeCount = userBadges.length;
      await supabase.rpc('check_and_award_badges', { user_id: user.id });
      await fetchUserBadges();
      
      // Show toast if new badges were earned
      const newBadgeCount = userBadges.length;
      if (newBadgeCount > previousBadgeCount) {
        toast({
          title: "🎉 Badge Earned!",
          description: `You've earned ${newBadgeCount - previousBadgeCount} new badge(s)!`,
        });
      }
    } catch (err: any) {
      console.error('Error checking badges:', err);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchBadges(),
      fetchUserBadges(),
      fetchUserStreak(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  return {
    badges,
    userBadges,
    streak,
    totalPoints,
    loading,
    updateStreak,
    checkAndAwardBadges,
    refetch: fetchAllData,
  };
};
