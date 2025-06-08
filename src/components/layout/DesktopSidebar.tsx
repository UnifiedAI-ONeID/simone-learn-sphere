import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Home, BookOpen, Users, BarChart3, Shield, Settings, Bot } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { LocalizedText } from '@/components/LocalizedText';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export const DesktopSidebar = () => {
  const { role } = useUserRole();

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', path: `/${role}-dashboard` },
      { icon: Settings, label: 'Settings', path: '/profile-settings' },
    ];

    if (role === 'student') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'Browse Courses', path: '/student-dashboard', tab: 'courses' },
        { icon: Bot, label: 'AI Tutor', path: '/student-dashboard', tab: 'ai-tutor' },
        { icon: BarChart3, label: 'Progress', path: '/student-dashboard', tab: 'progress' },
        ...baseItems.slice(1),
      ];
    }

    if (role === 'educator') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BookOpen, label: 'My Courses', path: '/educator-dashboard', tab: 'courses' },
        { icon: Bot, label: 'AI Planner', path: '/educator-dashboard', tab: 'ai-planner' },
        { icon: Users, label: 'AI Content', path: '/educator-dashboard', tab: 'content-gen' },
        { icon: BarChart3, label: 'Create Course', path: '/educator-dashboard', tab: 'create' },
        ...baseItems.slice(1),
      ];
    }

    if (role === 'admin') {
      return [
        ...baseItems.slice(0, 1),
        { icon: BarChart3, label: 'Metrics', path: '/admin-dashboard', tab: 'metrics' },
        { icon: Shield, label: 'Security', path: '/admin-dashboard', tab: 'security' },
        { icon: Users, label: 'Users', path: '/admin-dashboard', tab: 'users' },
        { icon: BookOpen, label: 'Activity', path: '/admin-dashboard', tab: 'activity' },
        ...baseItems.slice(1),
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          <UnifiedLocalizedText text="SimoneLabs" />
        </h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">
              <LocalizedText text={item.label} />
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
