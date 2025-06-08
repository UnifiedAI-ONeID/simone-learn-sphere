
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X,
  BookOpen,
  Users,
  Shield,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { LocalizedText } from '@/components/LocalizedText';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { role, hasRole } = useUserRole();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navigationItems = [
    ...(hasRole('student') ? [{
      icon: BookOpen,
      label: 'Student Dashboard',
      path: '/student-dashboard',
      roles: ['student', 'educator', 'admin']
    }] : []),
    ...(hasRole('educator') ? [{
      icon: Users,
      label: 'Educator Dashboard',
      path: '/educator-dashboard',
      roles: ['educator', 'admin']
    }] : []),
    ...(hasRole('admin') ? [{
      icon: Shield,
      label: 'Admin Dashboard',
      path: '/admin-dashboard',
      roles: ['admin']
    }] : [])
  ];

  const userInitials = user?.user_metadata?.first_name && user?.user_metadata?.last_name 
    ? `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <LocalizedText text="SimoneLabs" />
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* User Profile */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name} || user?.email
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    <LocalizedText text={role?.charAt(0).toUpperCase() + role?.slice(1) || 'User'} />
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <LocalizedText text={item.label} />
              </Button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <User className="h-4 w-4 mr-3" />
              <LocalizedText text="Profile" />
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="h-4 w-4 mr-3" />
              <LocalizedText text="Settings" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <LocalizedText text="Sign Out" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  <LocalizedText text={title} />
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">
                    <LocalizedText text={subtitle} />
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                <BarChart3 className="h-3 w-3 mr-1" />
                <LocalizedText text="Online" />
              </Badge>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
