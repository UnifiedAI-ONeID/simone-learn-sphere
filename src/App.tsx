
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { UnifiedLocalizationProvider } from '@/contexts/UnifiedLocalizationContext';
import { PlatformThemeProvider } from '@/contexts/PlatformThemeContext';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';
import { TranslationErrorBoundary } from '@/components/TranslationErrorBoundary';
import { SecurityProvider } from '@/components/SecurityProvider';
import { Toaster } from 'react-hot-toast';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

// Mobile Pages - using named imports
import { MobileAuth } from '@/pages/mobile/MobileAuth';
import { MobileAuthCallback } from '@/pages/mobile/MobileAuthCallback';
import { MobileIndex } from '@/pages/mobile/MobileIndex';
import { MobileProfileSettings } from '@/pages/mobile/MobileProfileSettings';
import { MobileNotFound } from '@/pages/mobile/MobileNotFound';
import { MobileStudentDashboard } from '@/pages/student/MobileStudentDashboard';
import { MobileEducatorDashboard } from '@/pages/educator/MobileEducatorDashboard';
import { MobileAdminDashboard } from '@/pages/admin/MobileAdminDashboard';

// Desktop Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import StudentDashboard from '@/pages/StudentDashboard';
import EducatorDashboard from '@/pages/EducatorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import CourseBuilder from '@/pages/CourseBuilder';
import ProfileSettings from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';

// Student Flow Pages
import { CourseOverview } from '@/pages/student/CourseOverview';
import { LessonView } from '@/pages/student/LessonView';
import { Assignments } from '@/pages/student/Assignments';
import { QuizView } from '@/pages/student/QuizView';
import { AITutor } from '@/pages/student/AITutor';
import { ProfileBadges } from '@/pages/student/ProfileBadges';
import { Leaderboard } from '@/pages/student/Leaderboard';
import { Forums } from '@/pages/student/Forums';
import { StudyGroups } from '@/pages/student/StudyGroups';

// Educator Flow Pages
import { CourseCreate } from '@/pages/educator/CourseCreate';
import { CourseEditor } from '@/pages/educator/CourseEditor';
import { CourseAnalytics } from '@/pages/educator/CourseAnalytics';
import { StudentInsights } from '@/pages/educator/StudentInsights';
import { RevenueAnalytics } from '@/pages/educator/RevenueAnalytics';
import { Announcements } from '@/pages/educator/Announcements';

// Admin Flow Pages
import { PlatformAnalytics } from '@/pages/admin/PlatformAnalytics';
import { UserManagement } from '@/pages/admin/UserManagement';
import { UserProfile } from '@/pages/admin/UserProfile';
import { PayoutsRevenue } from '@/pages/admin/PayoutsRevenue';
import { AIAuditTrail } from '@/pages/admin/AIAuditTrail';
import { ModerationReports } from '@/pages/admin/ModerationReports';
import { SystemSettings } from '@/pages/admin/SystemSettings';

import '@/App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function AppRoutes() {
  const platform = usePlatformDetection();
  const isMobile = platform === 'ios' || platform === 'android';
  
  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<MobileIndex />} />
        <Route path="/auth" element={<MobileAuth />} />
        <Route path="/auth/callback" element={<MobileAuthCallback />} />
        <Route path="/profile" element={<MobileProfileSettings />} />
        <Route path="/student/*" element={<MobileStudentDashboard />} />
        <Route path="/educator/*" element={<MobileEducatorDashboard />} />
        <Route path="/admin/*" element={<MobileAdminDashboard />} />
        
        {/* Mobile-specific routes for detailed flows */}
        <Route path="/ai-tutor" element={<AITutor />} />
        <Route path="/course/:id/overview" element={<CourseOverview />} />
        <Route path="/forums" element={<Forums />} />
        <Route path="/study-groups" element={<StudyGroups />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        <Route path="/404" element={<MobileNotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/course/:id/overview" element={<CourseOverview />} />
      <Route path="/course/:id/module/:moduleId/lesson/:lessonId" element={<LessonView />} />
      <Route path="/course/:id/assignments" element={<Assignments />} />
      <Route path="/course/:id/quiz/:quizId" element={<QuizView />} />
      <Route path="/ai-tutor" element={<AITutor />} />
      <Route path="/profile/badges" element={<ProfileBadges />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/forums/:courseId" element={<Forums />} />
      <Route path="/study-groups/:groupId/live" element={<StudyGroups />} />
      
      {/* Educator Routes */}
      <Route path="/educator" element={<EducatorDashboard />} />
      <Route path="/educator/course/create" element={<CourseCreate />} />
      <Route path="/educator/course/:id/editor" element={<CourseEditor />} />
      <Route path="/educator/course/:id/analytics" element={<CourseAnalytics />} />
      <Route path="/educator/course/:id/students" element={<StudentInsights />} />
      <Route path="/educator/course/:id/student/:userId/insights" element={<StudentInsights />} />
      <Route path="/educator/revenue" element={<RevenueAnalytics />} />
      <Route path="/educator/announcements" element={<Announcements />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/analytics" element={<PlatformAnalytics />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/user/:userId" element={<UserProfile />} />
      <Route path="/admin/payouts" element={<PayoutsRevenue />} />
      <Route path="/admin/ai-logs" element={<AIAuditTrail />} />
      <Route path="/admin/reports" element={<ModerationReports />} />
      <Route path="/admin/settings" element={<SystemSettings />} />
      
      <Route path="/course-builder" element={<CourseBuilder />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

function App() {
  useOptimizedPerformance('App');

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UnifiedLocalizationProvider>
          <TranslationErrorBoundary>
            <PlatformThemeProvider>
              <AuthProvider>
                <SecurityProvider>
                  <Router>
                    <AppRoutes />
                    <Toaster 
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                        },
                        success: {
                          iconTheme: {
                            primary: 'var(--primary)',
                            secondary: 'var(--primary-foreground)',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: 'var(--destructive)',
                            secondary: 'var(--destructive-foreground)',
                          },
                        },
                      }}
                    />
                  </Router>
                </SecurityProvider>
              </AuthProvider>
            </PlatformThemeProvider>
          </TranslationErrorBoundary>
        </UnifiedLocalizationProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
