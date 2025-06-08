import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Lightbulb, 
  MessageCircle, 
  HelpCircle,
  Sparkles,
  Brain,
  User,
  Loader2,
  RefreshCw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useLocation } from 'react-router-dom';

interface AIHelpSuggestion {
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}

export const ContextualAIHelper: React.FC = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const contextualHelp = useMemo(() => {
    const suggestions: AIHelpSuggestion[] = [];
    
    // Role-based suggestions
    if (role === 'student') {
      if (location.pathname.includes('/dashboard')) {
        suggestions.push({
          title: 'Start Your Learning Journey',
          description: 'Browse available courses and enroll in subjects that interest you',
          action: 'Explore Courses',
          icon: <BookOpen className="w-4 h-4" />
        });
        suggestions.push({
          title: 'Track Your Progress',
          description: 'View your learning analytics and achievement badges',
          action: 'View Progress',
          icon: <BarChart3 className="w-4 h-4" />
        });
        suggestions.push({
          title: 'Get AI Tutoring',
          description: 'Ask questions and get personalized help with your studies',
          action: 'Ask AI Tutor',
          icon: <Brain className="w-4 h-4" />
        });
      }
    } else if (role === 'educator') {
      if (location.pathname.includes('/dashboard')) {
        suggestions.push({
          title: 'Create Your First Course',
          description: 'Use our AI-powered course builder to create engaging content',
          action: 'Create Course',
          icon: <BookOpen className="w-4 h-4" />
        });
        suggestions.push({
          title: 'AI Content Generator',
          description: 'Generate lesson plans, quizzes, and educational materials automatically',
          action: 'Generate Content',
          icon: <Brain className="w-4 h-4" />
        });
        suggestions.push({
          title: 'Analyze Student Performance',
          description: 'View detailed analytics on student engagement and progress',
          action: 'View Analytics',
          icon: <BarChart3 className="w-4 h-4" />
        });
      }
    } else if (role === 'admin') {
      if (location.pathname.includes('/dashboard')) {
        suggestions.push({
          title: 'User Management',
          description: 'Manage user accounts, roles, and permissions',
          action: 'Manage Users',
          icon: <Users className="w-4 h-4" />
        });
        suggestions.push({
          title: 'System Configuration',
          description: 'Configure platform settings and security policies',
          action: 'System Settings',
          icon: <Settings className="w-4 h-4" />
        });
        suggestions.push({
          title: 'Security Monitoring',
          description: 'Monitor security events and maintain platform integrity',
          action: 'Security Center',
          icon: <Shield className="w-4 h-4" />
        });
      }
    }

    // Context-specific suggestions
    if (location.pathname.includes('/course')) {
      suggestions.push({
        title: 'Course Navigation Help',
        description: 'Learn how to navigate lessons and complete assignments',
        action: 'Navigation Guide',
        icon: <HelpCircle className="w-4 h-4" />
      });
    }

    if (location.pathname.includes('/lesson')) {
      suggestions.push({
        title: 'Need Help with This Lesson?',
        description: 'Get AI assistance with the current lesson content',
        action: 'Ask About Lesson',
        icon: <Brain className="w-4 h-4" />
      });
    }

    return suggestions;
  }, [role, location.pathname]);

  if (!user || contextualHelp.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-40"
          size="sm"
          aria-label="Open AI Helper"
        >
          <Brain className="w-6 h-6 text-white" />
          <Badge className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs px-1">
            AI
          </Badge>
        </Button>
      )}

      {/* AI Helper Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-h-[600px] z-50">
          <Card className="shadow-2xl border-2 border-purple-200 dark:border-purple-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <UnifiedLocalizedText text="AI Assistant" />
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                  aria-label="Close AI helper"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Badge variant="outline" className="text-xs">
                  <UnifiedLocalizedText text={`${role} Dashboard`} />
                </Badge>
                <span className="text-xs">
                  <UnifiedLocalizedText text="Context-aware help" />
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                <Lightbulb className="w-4 h-4" />
                <UnifiedLocalizedText text="Suggested Actions" />
              </div>
              
              {contextualHelp.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        <UnifiedLocalizedText text={suggestion.title} />
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <UnifiedLocalizedText text={suggestion.description} />
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs h-7"
                      >
                        <UnifiedLocalizedText text={suggestion.action} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <UnifiedLocalizedText text="Chat with AI" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
