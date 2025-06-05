
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
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import StudentDashboard from "./pages/StudentDashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
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
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    
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
                    
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
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
