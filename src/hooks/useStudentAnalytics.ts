
import { useState, useEffect } from 'react';

export interface StudentAnalytics {
  enrolledCourses: number;
  completedLessons: number;
  currentStreak: number;
  totalPoints: number;
}

export const useStudentAnalytics = (): StudentAnalytics => {
  const [analytics, setAnalytics] = useState<StudentAnalytics>({
    enrolledCourses: 0,
    completedLessons: 0,
    currentStreak: 0,
    totalPoints: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    setAnalytics({
      enrolledCourses: 5,
      completedLessons: 23,
      currentStreak: 7,
      totalPoints: 1250
    });
  }, []);

  return analytics;
};
