
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, AlertTriangle, HelpCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  intent?: string;
  followUpQuestion?: string;
  suggestion?: string;
  timestamp: Date;
}

interface AITutorProps {
  lessonId?: string;
  quizContext?: boolean;
  className?: string;
}

export const AITutor: React.FC<AITutorProps> = ({ 
  lessonId, 
  quizContext = false, 
  className = '' 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'tutor',
        content: quizContext 
          ? "Hi! I'm here to help you understand the concepts, but I won't give direct answers. Ask me to explain ideas or help you think through problems!"
          : "Hello! I'm your AI tutor. Ask me anything about the lesson material and I'll help you understand the concepts better!",
        timestamp: new Date()
      }]);
    }
  }, [quizContext]);

  const handleSendQuestion = async () => {
    if (!question.trim() || !user || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: {
          question: question.trim(),
          lessonId,
          quizContext
        }
      });

      if (error) throw error;

      if (!data.success) {
        if (data.locked) {
          setIsLocked(true);
          toast({
            title: "AI Tutor Temporarily Unavailable",
            description: data.message,
            variant: "destructive",
          });
          return;
        }

        const tutorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'tutor',
          content: data.message,
          intent: data.intent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, tutorMessage]);
        return;
      }

      const tutorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: data.response || data.explanation,
        intent: data.intent,
        followUpQuestion: data.followUpQuestion,
        suggestion: data.suggestion,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, tutorMessage]);

    } catch (error) {
      console.error('AI Tutor error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI Tutor. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: "Sorry, I encountered an error. Please try rephrasing your question or try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const getIntentBadge = (intent?: string) => {
    switch (intent) {
      case 'cheat-attempt':
        return <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" />Learning Focus</Badge>;
      case 'learn':
        return <Badge variant="default" className="text-xs"><Lightbulb className="w-3 h-3 mr-1" />Great Question!</Badge>;
      default:
        return null;
    }
  };

  if (isLocked) {
    return (
      <Card className={`bg-red-50 border-red-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-red-800 mb-2">AI Tutor Temporarily Unavailable</h3>
          <p className="text-red-600">Please try again later or contact your instructor for help.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col h-[500px] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Tutor</span>
          {quizContext && (
            <Badge variant="outline" className="text-xs">
              <HelpCircle className="w-3 h-3 mr-1" />
              Quiz Mode
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">
                      {message.type === 'user' ? 'You' : 'AI Tutor'}
                    </span>
                    {message.intent && getIntentBadge(message.intent)}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.followUpQuestion && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
                      <strong>Think about this:</strong> {message.followUpQuestion}
                    </div>
                  )}
                  
                  {message.suggestion && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-green-800 text-sm">
                      <strong>Tip:</strong> {message.suggestion}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                    <span className="text-sm">AI Tutor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={quizContext 
                ? "Ask me to explain a concept..." 
                : "Ask me anything about the lesson..."
              }
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendQuestion}
              disabled={!question.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {quizContext && (
            <p className="text-xs text-gray-500 mt-2">
              I'll help you understand concepts, but won't give direct answers to quiz questions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
