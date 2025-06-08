
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { PlatformThemeProvider } from '@/contexts/PlatformThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TranslationErrorBoundary } from '@/components/TranslationErrorBoundary';
import { SecurityProvider } from '@/components/SecurityProvider';
import { Toaster } from 'react-hot-toast';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

// Mobile Pages
import MobileAuth from '@/pages/mobile/MobileAuth';
import MobileAuthCallback from '@/pages/mobile/MobileAuthCallback';
import MobileIndex from '@/pages/mobile/MobileIndex';
import MobileProfileSettings from '@/pages/mobile/MobileProfileSettings';
import MobileNotFound from '@/pages/mobile/MobileNotFound';
import MobileStudentDashboard from '@/pages/student/MobileStudentDashboard';
import MobileEducatorDashboard from '@/pages/educator/MobileEducatorDashboard';
import MobileAdminDashboard from '@/pages/admin/MobileAdminDashboard';

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

import '@/App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

function AppRoutes() {
  const { isMobile } = usePlatformDetection();
  
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
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/educator" element={<EducatorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/course-builder" element={<CourseBuilder />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

function App() {
  useOptimizedPerformance();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider>
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
                          background: '#363636',
                          color: '#fff',
                        },
                      }}
                    />
                  </Router>
                </SecurityProvider>
              </AuthProvider>
            </PlatformThemeProvider>
          </TranslationErrorBoundary>
        </LocalizationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
