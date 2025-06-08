
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlatformThemeProvider } from '@/contexts/PlatformThemeContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { isMobile, isTablet } from 'react-device-detect';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Import pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import StudentDashboard from '@/pages/StudentDashboard';
import EducatorDashboard from '@/pages/EducatorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import ProfileSettings from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';
import CourseBuilder from '@/pages/CourseBuilder';

// Mobile pages
import { MobileIndex } from '@/pages/mobile/MobileIndex';
import { MobileAuth } from '@/pages/mobile/MobileAuth';
import { MobileAuthCallback } from '@/pages/mobile/MobileAuthCallback';
import { MobileStudentDashboard } from '@/pages/student/MobileStudentDashboard';
import { MobileEducatorDashboard } from '@/pages/educator/MobileEducatorDashboard';
import { MobileAdminDashboard } from '@/pages/admin/MobileAdminDashboard';
import { MobileProfileSettings } from '@/pages/mobile/MobileProfileSettings';
import { MobileNotFound } from '@/pages/mobile/MobileNotFound';

// Layout components
import { DesktopLayout } from '@/components/layout/DesktopLayout';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const isMobileDevice = isMobile || isTablet;
  usePlatformDetection();

  if (isMobileDevice) {
    return (
      <Routes>
        <Route path="/" element={<MobileIndex />} />
        <Route path="/auth" element={<MobileAuth />} />
        <Route path="/auth/callback" element={<MobileAuthCallback />} />
        <Route path="*" element={<MobileLayout />}>
          <Route 
            path="student-dashboard" 
            element={
              <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <MobileStudentDashboard />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="educator-dashboard" 
            element={
              <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
                <MobileEducatorDashboard />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="admin-dashboard" 
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <MobileAdminDashboard />
              </RoleProtectedRoute>
            } 
          />
          <Route 
            path="profile-settings" 
            element={
              <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <MobileProfileSettings />
              </RoleProtectedRoute>
            } 
          />
          <Route path="*" element={<MobileNotFound />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<DesktopLayout />}>
        <Route 
          path="student-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
              <StudentDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="educator-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
              <EducatorDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="admin-dashboard" 
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="course-builder" 
          element={
            <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
              <CourseBuilder />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="profile-settings" 
          element={
            <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
              <ProfileSettings />
            </RoleProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PlatformThemeProvider>
          <LocalizationProvider>
            <AuthProvider>
              <Router>
                <AppContent />
                <Toaster />
                <HotToaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                    },
                  }}
                />
              </Router>
            </AuthProvider>
          </LocalizationProvider>
        </PlatformThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
