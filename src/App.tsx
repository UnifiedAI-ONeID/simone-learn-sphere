import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './hooks/useAuth';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { LanguageSelector } from '@/components/LanguageSelector';

function App() {
  const { user, logout, loading } = useAuth();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', localStorage.theme === 'dark');
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Toaster />
            
            {/* Navigation Header with Language Selector */}
            {user && (
              <header className="border-b bg-white dark:bg-gray-900 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        SimoneLabs
                      </h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <LanguageSelector />
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
            )}

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
              <Route
                path="/dashboard"
                element={
                  user ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  user ? (
                    <StudentDashboard />
                  ) : (
                    <Navigate to="/auth" />
                  )
                }
              />
            </Routes>
          </div>
        </Router>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;
