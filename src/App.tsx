
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlatformThemeProvider } from '@/contexts/PlatformThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SecurityProvider } from '@/components/SecurityProvider';
import { SecurityHeadersProvider } from '@/components/security/SecurityHeadersProvider';
import { EnhancedSecurityAlert } from '@/components/security/EnhancedSecurityAlert';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TranslationErrorBoundary } from '@/components/TranslationErrorBoundary';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import StudentDashboard from '@/pages/StudentDashboard';
import EducatorDashboard from '@/pages/EducatorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { MobileIndex } from '@/pages/mobile/MobileIndex';
import { MobileAuthCallback } from '@/pages/mobile/MobileAuthCallback';
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

  return (
    <ErrorBoundary>
      <SecurityHeadersProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <PlatformThemeProvider>
              <LanguageProvider>
                <TranslationErrorBoundary>
                  <AuthProvider>
                    <SecurityProvider>
                      <Router>
                        <div className="min-h-screen bg-background">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/student-dashboard" element={<StudentDashboard />} />
                            <Route path="/educator-dashboard" element={<EducatorDashboard />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            {platform === 'mobile' && (
                              <>
                                <Route path="/mobile" element={<MobileIndex />} />
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
              </LanguageProvider>
            </PlatformThemeProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SecurityHeadersProvider>
    </ErrorBoundary>
  );
}

export default App;
