
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  X, 
  HelpCircle 
} from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface ContextualAIHelperProps {
  currentPage: string;
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export const ContextualAIHelper: React.FC<ContextualAIHelperProps> = ({
  currentPage,
  onSuggestionClick,
  className = ''
}) => {
  const { role } = useUserRole();
  const [isVisible, setIsVisible] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const getContextualSuggestions = () => {
    if (role === 'student') {
      switch (currentPage) {
        case 'dashboard':
          return [
            'How can I track my learning progress?',
            'What courses are recommended for me?',
            'How do I use the AI tutor effectively?'
          ];
        case 'courses':
          return [
            'How do I enroll in a new course?',
            'What are the prerequisites for this course?',
            'How can I see my course completion status?'
          ];
        case 'ai-tutor':
          return [
            'How can the AI tutor help me study?',
            'Can you explain this concept in simpler terms?',
            'What study techniques work best for this topic?'
          ];
        default:
          return [
            'How can I improve my learning experience?',
            'What features are available to students?'
          ];
      }
    }

    if (role === 'educator') {
      switch (currentPage) {
        case 'dashboard':
          return [
            'How can I create engaging course content?',
            'What analytics are available for my courses?',
            'How do I track student progress?'
          ];
        case 'courses':
          return [
            'How do I create a new course?',
            'What are best practices for course structure?',
            'How can I make my content more interactive?'
          ];
        case 'analytics':
          return [
            'How do I interpret student engagement metrics?',
            'What does the completion rate tell me?',
            'How can I improve course performance?'
          ];
        default:
          return [
            'How can I enhance my teaching effectiveness?',
            'What tools are available for educators?'
          ];
      }
    }

    if (role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return [
            'How do I monitor platform health?',
            'What security measures are in place?',
            'How can I view user analytics?'
          ];
        case 'users':
          return [
            'How do I manage user accounts?',
            'What user roles are available?',
            'How can I handle user support requests?'
          ];
        case 'security':
          return [
            'How do I review security logs?',
            'What are the current security threats?',
            'How can I improve platform security?'
          ];
        case 'settings':
          return [
            'How do I configure platform settings?',
            'What administrative controls are available?',
            'How can I manage system preferences?'
          ];
        default:
          return [
            'How can I optimize platform performance?',
            'What administrative features are available?'
          ];
      }
    }

    return [
      'How can I get started with this platform?',
      'What features are available to me?'
    ];
  };

  useEffect(() => {
    setSuggestions(getContextualSuggestions());
  }, [currentPage, role]);

  if (!isVisible) return null;

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">
              <UnifiedLocalizedText text="AI Assistant" />
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <UnifiedLocalizedText text="Smart Help" />
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          <UnifiedLocalizedText text="Contextual suggestions for your current page" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="w-full text-left justify-start h-auto p-3"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-xs text-wrap">{suggestion}</span>
          </Button>
        ))}
        
        <div className="pt-2 border-t">
          <Button
            size="sm"
            className="w-full"
            onClick={() => onSuggestionClick('I need help with something else')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Ask Custom Question" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
