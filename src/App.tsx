
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlatformThemeProvider } from '@/contexts/PlatformThemeContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { SecurityProvider } from '@/components/SecurityProvider';
import { SecurityHeadersProvider } from '@/components/security/SecurityHeadersProvider';
import { EnhancedSecurityAlert } from '@/components/security/EnhancedSecurityAlert';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TranslationErrorBoundary } from '@/components/TranslationErrorBoundary';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import StudentDashboard from '@/pages/StudentDashboard';
import EducatorDashboard from '@/pages/EducatorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { MobileIndex } from '@/pages/mobile/MobileIndex';
import { MobileAuth } from '@/pages/mobile/MobileAuth';
import { MobileAuthCallback } from '@/pages/mobile/MobileAuthCallback';
import { MobileStudentDashboard } from '@/pages/student/MobileStudentDashboard';
import { MobileEducatorDashboard } from '@/pages/educator/MobileEducatorDashboard';
import { MobileAdminDashboard } from '@/pages/admin/MobileAdminDashboard';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error?.message?.includes('JWT') || error?.message?.includes('auth')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const platform = usePlatformDetection();
  const isMobile = platform === 'ios' || platform === 'android';

  return (
    <ErrorBoundary>
      <SecurityHeadersProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <PlatformThemeProvider>
              <LocalizationProvider>
                <TranslationErrorBoundary>
                  <AuthProvider>
                    <SecurityProvider>
                      <Router>
                        <div className="min-h-screen bg-background">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            
                            {/* Protected Dashboard Routes */}
                            <Route 
                              path="/student-dashboard" 
                              element={
                                <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                                  {isMobile ? <MobileStudentDashboard /> : <StudentDashboard />}
                                </RoleProtectedRoute>
                              } 
                            />
                            <Route 
                              path="/educator-dashboard" 
                              element={
                                <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
                                  {isMobile ? <MobileEducatorDashboard /> : <EducatorDashboard />}
                                </RoleProtectedRoute>
                              } 
                            />
                            <Route 
                              path="/admin-dashboard" 
                              element={
                                <RoleProtectedRoute allowedRoles={['admin']}>
                                  {isMobile ? <MobileAdminDashboard /> : <AdminDashboard />}
                                </RoleProtectedRoute>
                              } 
                            />
                            
                            {/* Mobile-specific routes */}
                            {isMobile && (
                              <>
                                <Route path="/mobile" element={<MobileIndex />} />
                                <Route path="/mobile/auth" element={<MobileAuth />} />
                                <Route path="/mobile/auth/callback" element={<MobileAuthCallback />} />
                              </>
                            )}
                          </Routes>
                          <EnhancedSecurityAlert />
                          <Toaster position="top-right" />
                        </div>
                      </Router>
                    </SecurityProvider>
                  </AuthProvider>
                </TranslationErrorBoundary>
              </LocalizationProvider>
            </PlatformThemeProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SecurityHeadersProvider>
    </ErrorBoundary>
  );
}

export default App;
