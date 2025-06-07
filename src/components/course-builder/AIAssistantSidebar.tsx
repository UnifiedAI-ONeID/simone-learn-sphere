
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, X, Wand2, FileText, Video, HelpCircle, Target, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatGPT } from '@/hooks/useChatGPT';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: any[];
}

interface AIAssistantSidebarProps {
  course: Course;
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
}

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({
  course,
  onClose,
  onApplySuggestion,
}) => {
  const { toast } = useToast();
  const { messages, sendMessage, isLoading } = useChatGPT();
  const [prompt, setPrompt] = useState('');

  const quickActions = [
    {
      icon: FileText,
      title: 'Generate Quiz',
      description: 'Create comprehension quiz for current content',
      prompt: 'Generate a 5-question quiz for this lesson content'
    },
    {
      icon: Target,
      title: 'Learning Objectives',
      description: 'Suggest learning objectives for this module',
      prompt: 'Create 3-5 specific learning objectives for this module'
    },
    {
      icon: Lightbulb,
      title: 'Content Ideas',
      description: 'Get suggestions for lesson topics',
      prompt: 'Suggest 5 engaging lesson topics for this course'
    },
    {
      icon: HelpCircle,
      title: 'FAQ Generator',
      description: 'Generate common student questions',
      prompt: 'Generate 5 frequently asked questions students might have'
    }
  ];

  const handleQuickAction = (actionPrompt: string) => {
    const contextualPrompt = `
      Course: ${course.title}
      Description: ${course.description}
      Current modules: ${course.modules.length}
      
      ${actionPrompt}
      
      Please provide a structured response that I can easily apply to the course.
    `;
    sendMessage(contextualPrompt);
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    
    const contextualPrompt = `
      Course context:
      - Title: ${course.title}
      - Description: ${course.description}
      - Number of modules: ${course.modules.length}
      
      User request: ${prompt}
      
      Please provide actionable suggestions for improving this course.
    `;
    
    sendMessage(contextualPrompt);
    setPrompt('');
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">AI Assistant</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-2 flex flex-col items-start text-left"
                onClick={() => handleQuickAction(action.prompt)}
              >
                <action.icon className="w-4 h-4 mb-1 text-purple-600" />
                <span className="text-xs font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm">
                <Brain className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>Ask me anything about your course!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-purple-100 text-purple-900 ml-4'
                      : 'bg-gray-100 text-gray-900 mr-4'
                  }`}
                >
                  {message.content}
                  {message.role === 'assistant' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 text-xs"
                      onClick={() => onApplySuggestion(message.content)}
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Apply
                    </Button>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm mr-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI for help..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleSendPrompt}
                disabled={isLoading || !prompt.trim()}
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
