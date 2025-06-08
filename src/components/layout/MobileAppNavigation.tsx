
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Settings, Brain, Shield } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { getRoleBasedRoute } from '@/utils/roleRouting';

export const MobileAppNavigation = () => {
  const { role } = useUserRole();
  const location = useLocation();

  const handleNavClick = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics not available on web
    }
  };

  const getNavItems = () => {
    if (role === 'student') {
      return [
        { icon: Home, label: 'Dashboard', path: getRoleBasedRoute('student', true) },
        { icon: BookOpen, label: 'Courses', path: '/student-dashboard' },
        { icon: Brain, label: 'AI Tutor', path: '/student-dashboard' },
        { icon: Settings, label: 'Settings', path: '/profile-settings' },
      ];
    }

    if (role === 'educator') {
      return [
        { icon: Home, label: 'Dashboard', path: getRoleBasedRoute('educator', true) },
        { icon: BookOpen, label: 'Courses', path: '/educator-dashboard' },
        { icon: Brain, label: 'AI Tools', path: '/educator-dashboard' },
        { icon: Settings, label: 'Settings', path: '/profile-settings' },
      ];
    }

    if (role === 'admin') {
      return [
        { icon: Home, label: 'Dashboard', path: getRoleBasedRoute('admin', true) },
        { icon: Users, label: 'Users', path: '/admin-dashboard' },
        { icon: Shield, label: 'Security', path: '/admin-dashboard' },
        { icon: Settings, label: 'Settings', path: '/profile-settings' },
      ];
    }

    // Fallback for unrecognized roles
    return [
      { icon: Home, label: 'Dashboard', path: '/' },
      { icon: Settings, label: 'Settings', path: '/profile-settings' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
                          (location.pathname.startsWith('/student-dashboard') && item.path === '/student-dashboard') ||
                          (location.pathname.startsWith('/educator-dashboard') && item.path === '/educator-dashboard') ||
                          (location.pathname.startsWith('/admin-dashboard') && item.path === '/admin-dashboard');
          
          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "text-purple-600 bg-purple-50 shadow-sm scale-105" 
                  : "text-gray-500 hover:text-gray-700 active:scale-95"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "animate-pulse")} />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
