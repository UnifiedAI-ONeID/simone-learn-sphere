import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, MessageCircle, ArrowLeft, Lightbulb, BookOpen } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const StudentAITutor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'assistant',
      content: 'Hi! I\'m your AI study assistant. I can help you understand concepts, practice problems, or answer questions about your courses. What would you like to learn today?'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, 
      { type: 'user', content: message },
      { type: 'assistant', content: 'I understand your question. Let me help you with that...' }
    ]);
    setMessage('');
  };

  const quickPrompts = [
    'Explain React hooks in simple terms',
    'Help me practice JavaScript arrays',
    'What are the key concepts in this lesson?',
    'Create a quiz for this topic',
    'Suggest study resources'
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/student/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <UnifiedLocalizedText text="AI Study Assistant" />
            </h1>
            <p className="text-muted-foreground">
              <UnifiedLocalizedText text="Get personalized help with your studies" />
            </p>
          </div>
        </div>
        {lessonId && (
          <Badge variant="secondary">
            Lesson Context: {lessonId}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <UnifiedLocalizedText text="Chat" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-primary text-primary-foreground ml-4' 
                        : 'bg-muted mr-4'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your studies..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <UnifiedLocalizedText text="Quick Help" />
              </CardTitle>
              <CardDescription>
                <UnifiedLocalizedText text="Common questions to get started" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => setMessage(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <UnifiedLocalizedText text="Study Tips" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Active Learning</h4>
                <p className="text-xs text-muted-foreground">
                  Ask specific questions about concepts you're struggling with.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Practice Problems</h4>
                <p className="text-xs text-muted-foreground">
                  Request practice exercises to reinforce your learning.
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Explanations</h4>
                <p className="text-xs text-muted-foreground">
                  Ask for step-by-step explanations of complex topics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
