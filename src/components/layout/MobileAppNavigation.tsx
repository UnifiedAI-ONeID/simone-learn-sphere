
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Settings, Brain } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/${role}-dashboard` },
      { icon: Settings, label: 'Settings', path: '/profile-settings' },
    ];

    if (role === 'student') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'Courses', path: '/student-dashboard', tab: 'courses' },
        { icon: Brain, label: 'AI Tutor', path: '/student-dashboard', tab: 'ai-tutor' },
        ...baseItems.slice(1),
      ];
    }

    if (role === 'educator') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'Courses', path: '/educator-dashboard', tab: 'courses' },
        { icon: Brain, label: 'AI Tools', path: '/educator-dashboard', tab: 'ai-planner' },
        ...baseItems.slice(1),
      ];
    }

    if (role === 'admin') {
      return [
        ...baseItems.slice(0, 1),
        { icon: Users, label: 'Users', path: '/admin-dashboard', tab: 'users' },
        { icon: BookOpen, label: 'Security', path: '/admin-dashboard', tab: 'security' },
        ...baseItems.slice(1),
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
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
