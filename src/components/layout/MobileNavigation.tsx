
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, Settings } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

export const MobileNavigation = () => {
  const { role } = useUserRole();
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/${role}-dashboard` },
      { icon: Settings, label: 'Settings', path: '/profile-settings' },
    ];

    if (role === 'student') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'Courses', path: '/student-dashboard', tab: 'courses' },
        { icon: Users, label: 'AI Tutor', path: '/student-dashboard', tab: 'ai-tutor' },
        ...baseItems.slice(1),
      ];
    }

    if (role === 'educator') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'Courses', path: '/educator-dashboard', tab: 'courses' },
        { icon: Users, label: 'AI Tools', path: '/educator-dashboard', tab: 'ai-planner' },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-2 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={index}
              to={item.path}
              className={cn(
                "flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
