
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { PlatformThemeProvider } from "@/contexts/PlatformThemeContext";
import { SecurityProvider } from "@/components/SecurityProvider";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { MobileAppLayout } from "@/components/layout/MobileAppLayout";
import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { Suspense, lazy, useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { usePlatformDetection } from '@/hooks/usePlatformDetection';

// Lazy load pages for optimal performance
const MobileIndex = lazy(() => import('./pages/mobile/MobileIndex').then(module => ({ default: module.MobileIndex })));
const MobileAuth = lazy(() => import('./pages/mobile/MobileAuth').then(module => ({ default: module.MobileAuth })));
const MobileAuthCallback = lazy(() => import('./pages/mobile/MobileAuthCallback').then(module => ({ default: module.MobileAuthCallback })));
const MobileStudentDashboard = lazy(() => import('./pages/student/MobileStudentDashboard').then(module => ({ default: module.MobileStudentDashboard })));
const MobileEducatorDashboard = lazy(() => import('./pages/educator/MobileEducatorDashboard').then(module => ({ default: module.MobileEducatorDashboard })));
const MobileAdminDashboard = lazy(() => import('./pages/admin/MobileAdminDashboard').then(module => ({ default: module.MobileAdminDashboard })));
const MobileProfileSettings = lazy(() => import('./pages/mobile/MobileProfileSettings').then(module => ({ default: module.MobileProfileSettings })));
const MobileNotFound = lazy(() => import('./pages/mobile/MobileNotFound').then(module => ({ default: module.MobileNotFound })));

// Desktop pages
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const EducatorDashboard = lazy(() => import('./pages/EducatorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const MobileLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--platform-background)]">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-[var(--platform-primary)] rounded-full flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-[var(--platform-text-secondary)] font-medium">Loading SimoneLabs...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const platform = usePlatformDetection();

  if (platform === 'desktop') {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route element={<DesktopLayout />}>
          <Route
            path="/student-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <StudentDashboard />
              </RoleProtectedRoute>
            }
          />
          
          <Route
            path="/educator-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
                <EducatorDashboard />
              </RoleProtectedRoute>
            }
          />
          
          <Route
            path="/admin-dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          
          <Route
            path="/profile-settings"
            element={
              <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                <ProfileSettings />
              </RoleProtectedRoute>
            }
          />
        </Route>
        
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    );
  }

  // Mobile routes
  return (
    <Routes>
      <Route path="/" element={<MobileIndex />} />
      <Route path="/auth" element={<MobileAuth />} />
      <Route path="/auth/callback" element={<MobileAuthCallback />} />
      
      <Route element={<MobileAppLayout />}>
        <Route
          path="/student-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
              <MobileStudentDashboard />
            </RoleProtectedRoute>
          }
        />
        
        <Route
          path="/educator-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
              <MobileEducatorDashboard />
            </RoleProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <MobileAdminDashboard />
            </RoleProtectedRoute>
          }
        />
        
        <Route
          path="/profile-settings"
          element={
            <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
              <MobileProfileSettings />
            </RoleProtectedRoute>
          }
        />
      </Route>
      
      <Route path="/404" element={<MobileNotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    const initializeMobileApp = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#6366f1' });
        
        setTimeout(async () => {
          await SplashScreen.hide();
        }, 2000);
      } catch (error) {
        console.log('Not running on mobile device');
      }
    };

    initializeMobileApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LocalizationProvider>
              <PlatformThemeProvider>
                <SecurityProvider>
                  <div className="min-h-screen bg-background">
                    <ImpersonationBanner />
                    <Suspense fallback={<MobileLoadingSpinner />}>
                      <AppRoutes />
                    </Suspense>
                  </div>
                </SecurityProvider>
              </PlatformThemeProvider>
            </LocalizationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
