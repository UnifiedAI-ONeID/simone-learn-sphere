
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";
import { SessionTimeoutWarning } from "./components/SessionTimeoutWarning";
import { usePerformanceTracking } from "./hooks/usePerformanceTracking";
import { useEngagementTracking } from "./hooks/useEngagementTracking";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Performance tracking wrapper for route components
const RouteWithTracking = ({ children, routeName }: { children: React.ReactNode; routeName: string }) => {
  const { trackPerformance } = usePerformanceTracking();
  const { trackEngagement } = useEngagementTracking();

  useEffect(() => {
    const startTime = Date.now();
    trackEngagement('page_view', undefined, { page: routeName });
    
    return () => {
      trackPerformance(routeName, startTime);
    };
  }, [routeName, trackPerformance, trackEngagement]);

  return <>{children}</>;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/student-dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <>
    <SessionTimeoutWarning />
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <RouteWithTracking routeName="/">
            <Index />
          </RouteWithTracking>
        </PublicRoute>
      } />
      <Route path="/auth" element={
        <PublicRoute>
          <RouteWithTracking routeName="/auth">
            <Auth />
          </RouteWithTracking>
        </PublicRoute>
      } />
      <Route path="/student-dashboard" element={
        <RoleProtectedRoute allowedRoles={['student', 'educator', 'admin']}>
          <RouteWithTracking routeName="/student-dashboard">
            <StudentDashboard />
          </RouteWithTracking>
        </RoleProtectedRoute>
      } />
      <Route path="/educator-dashboard" element={
        <RoleProtectedRoute allowedRoles={['educator', 'admin']}>
          <RouteWithTracking routeName="/educator-dashboard">
            <EducatorDashboard />
          </RouteWithTracking>
        </RoleProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <RoleProtectedRoute allowedRoles={['admin']}>
          <RouteWithTracking routeName="/admin-dashboard">
            <AdminDashboard />
          </RouteWithTracking>
        </RoleProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
