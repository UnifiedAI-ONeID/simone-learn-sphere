
import { useState, useEffect } from 'react';

export interface AdminAnalytics {
  totalUsers: number;
  activeCourses: number;
  engagementRate: number;
  securityAlerts: number;
}

export const useAdminAnalytics = (): AdminAnalytics => {
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    totalUsers: 0,
    activeCourses: 0,
    engagementRate: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setAnalytics({
      totalUsers: 12457,
      activeCourses: 156,
      engagementRate: 78,
      securityAlerts: 2
    });
  }, []);

  return analytics;
};
