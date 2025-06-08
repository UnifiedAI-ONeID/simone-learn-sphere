
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const LandingPageAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: "Hi! I'm Simone Helper, here to help you learn about SimoneLabs. Ask me about our features, pricing, how to get started, or anything else about our platform!",
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendQuestion = async () => {
    if (!question.trim() || isLoading) return;

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
      // For now, provide predefined responses based on common questions
      const response = getPlatformResponse(question.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      // Simulate AI thinking time
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Platform assistant error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try rephrasing your question or contact our support team.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const getPlatformResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('free')) {
      return "SimoneLabs is free to start! You can create courses, access basic AI features, and join our community at no cost. We also offer premium plans with advanced features for educators who need more powerful tools.";
    }
    
    if (lowerQuestion.includes('ai') || lowerQuestion.includes('artificial intelligence')) {
      return "Our AI-powered tools help you create course outlines, generate quizzes, provide personalized tutoring, and assist with content creation. The AI adapts to different learning styles and helps both educators and students achieve better outcomes.";
    }
    
    if (lowerQuestion.includes('course') || lowerQuestion.includes('create') || lowerQuestion.includes('build')) {
      return "You can easily create interactive courses using our drag-and-drop course builder. The AI assistant helps generate content, suggests improvements, and even creates quizzes automatically. Courses support video, text, images, and interactive elements.";
    }
    
    if (lowerQuestion.includes('student') || lowerQuestion.includes('learn')) {
      return "Students get personalized learning paths, AI tutoring support, gamified progress tracking with badges and streaks, and access to a global community of learners. The platform adapts to each student's pace and learning style.";
    }
    
    if (lowerQuestion.includes('mobile') || lowerQuestion.includes('phone') || lowerQuestion.includes('app')) {
      return "Yes! SimoneLabs is fully optimized for mobile devices. You can create, learn, and teach on the go. Our mobile interface is designed specifically for touch interactions and smaller screens.";
    }
    
    if (lowerQuestion.includes('start') || lowerQuestion.includes('begin') || lowerQuestion.includes('get started')) {
      return "Getting started is easy! Click the 'Get Started Free' button above to create your account. You can immediately start creating courses or enrolling in existing ones. No credit card required to begin!";
    }
    
    if (lowerQuestion.includes('feature') || lowerQuestion.includes('what') || lowerQuestion.includes('can')) {
      return "SimoneLabs offers AI-powered course creation, flexible learning delivery (self-paced, live, cohort-based), community features like forums and study groups, gamification with badges and streaks, and comprehensive analytics for educators.";
    }
    
    if (lowerQuestion.includes('educator') || lowerQuestion.includes('teacher') || lowerQuestion.includes('instructor')) {
      return "Educators can create unlimited courses, use AI for content generation, track student progress with detailed analytics, build communities around their courses, and monetize their expertise. We provide tools for both beginners and experienced instructors.";
    }
    
    // Default response for unmatched questions
    return "That's a great question! SimoneLabs is a comprehensive educational platform that democratizes learning worldwide. We combine AI-powered tools with community features to help educators create amazing courses and students achieve their learning goals. Would you like to know more about any specific aspect of our platform?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-40"
        size="sm"
        aria-label="Open Simone Helper"
      >
        <Brain className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'}`}>
      <Card className={`shadow-2xl border-2 border-purple-200 dark:border-purple-700 ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span><LocalizedText text="Simone Helper" /></span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                aria-label="Close Simone Helper"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 h-[calc(100%-80px)] flex flex-col">
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
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium">
                          {message.type === 'user' ? 'You' : 'Simone Helper'}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                        <span className="text-sm">Simone Helper is thinking...</span>
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
                  placeholder="Ask Simone Helper about SimoneLabs..."
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <LocalizedText text="Ask me about features, pricing, or getting started!" />
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
