
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { SecurityProvider } from "@/components/SecurityProvider";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { MobileAppLayout } from "@/components/layout/MobileAppLayout";
import { Suspense, lazy, useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Lazy load pages for optimal mobile performance
const MobileIndex = lazy(() => import('./pages/mobile/MobileIndex').then(module => ({ default: module.MobileIndex })));
const MobileAuth = lazy(() => import('./pages/mobile/MobileAuth').then(module => ({ default: module.MobileAuth })));
const MobileAuthCallback = lazy(() => import('./pages/mobile/MobileAuthCallback').then(module => ({ default: module.MobileAuthCallback })));
const MobileStudentDashboard = lazy(() => import('./pages/student/MobileStudentDashboard').then(module => ({ default: module.MobileStudentDashboard })));
const MobileEducatorDashboard = lazy(() => import('./pages/educator/MobileEducatorDashboard').then(module => ({ default: module.MobileEducatorDashboard })));
const MobileAdminDashboard = lazy(() => import('./pages/admin/MobileAdminDashboard').then(module => ({ default: module.MobileAdminDashboard })));
const MobileProfileSettings = lazy(() => import('./pages/mobile/MobileProfileSettings').then(module => ({ default: module.MobileProfileSettings })));
const MobileNotFound = lazy(() => import('./pages/mobile/MobileNotFound').then(module => ({ default: module.MobileNotFound })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Mobile optimized loading component
const MobileLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading SimoneLabs...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize mobile app
    const initializeMobileApp = async () => {
      try {
        // Configure status bar for mobile
        await StatusBar.setStyle({ style: 'DARK' });
        await StatusBar.setBackgroundColor({ color: '#6366f1' });
        
        // Hide splash screen after app is ready
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
            <TranslationProvider>
              <SecurityProvider>
                <div className="min-h-screen bg-background">
                  <ImpersonationBanner />
                  <Suspense fallback={<MobileLoadingSpinner />}>
                    <Routes>
                      {/* Public mobile routes */}
                      <Route path="/" element={<MobileIndex />} />
                      <Route path="/auth" element={<MobileAuth />} />
                      <Route path="/auth/callback" element={<MobileAuthCallback />} />
                      
                      {/* Protected mobile routes with app layout */}
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
                  </Suspense>
                </div>
              </SecurityProvider>
            </TranslationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
