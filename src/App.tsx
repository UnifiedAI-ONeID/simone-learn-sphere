
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
import { ChatPopup } from "@/components/ChatPopup";
import { isMobile, isTablet } from 'react-device-detect';
import { Suspense, lazy } from 'react';

// Lazy load layouts for performance
const MobileLayout = lazy(() => import('./components/layout/MobileLayout').then(module => ({ default: module.MobileLayout })));
const DesktopLayout = lazy(() => import('./components/layout/DesktopLayout').then(module => ({ default: module.DesktopLayout })));

// Lazy load pages
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const EducatorDashboard = lazy(() => import('./pages/EducatorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Mobile-specific dashboards
const MobileStudentDashboard = lazy(() => import('./pages/student/MobileStudentDashboard').then(module => ({ default: module.MobileStudentDashboard })));
const MobileEducatorDashboard = lazy(() => import('./pages/educator/MobileEducatorDashboard').then(module => ({ default: module.MobileEducatorDashboard })));
const MobileAdminDashboard = lazy(() => import('./pages/admin/MobileAdminDashboard').then(module => ({ default: module.MobileAdminDashboard })));

const queryClient = new QueryClient();

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

function App() {
  const isMobileDevice = isMobile || isTablet;

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
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      
                      {/* Protected routes with layout wrapper */}
                      <Route element={isMobileDevice ? <MobileLayout /> : <DesktopLayout />}>
                        <Route
                          path="/student-dashboard"
                          element={
                            <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
                              {isMobileDevice ? <MobileStudentDashboard /> : <StudentDashboard />}
                            </RoleProtectedRoute>
                          }
                        />
                        
                        <Route
                          path="/educator-dashboard"
                          element={
                            <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
                              {isMobileDevice ? <MobileEducatorDashboard /> : <EducatorDashboard />}
                            </RoleProtectedRoute>
                          }
                        />
                        
                        <Route
                          path="/admin-dashboard"
                          element={
                            <RoleProtectedRoute allowedRoles={['admin']}>
                              {isMobileDevice ? <MobileAdminDashboard /> : <AdminDashboard />}
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
                  </Suspense>
                  {!isMobileDevice && <ChatPopup />}
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
