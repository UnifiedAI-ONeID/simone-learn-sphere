
import { useState, useEffect } from 'react';

export interface EducatorAnalytics {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
}

export const useEducatorAnalytics = (): EducatorAnalytics => {
  const [analytics, setAnalytics] = useState<EducatorAnalytics>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setAnalytics({
      totalCourses: 8,
      totalStudents: 245,
      totalRevenue: 12500,
      avgRating: 4.7
    });
  }, []);

  return analytics;
};
