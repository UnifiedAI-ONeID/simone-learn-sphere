
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, BookOpen, HelpCircle } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const AITutor = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI tutor. I can help you understand concepts, answer questions, and provide study guidance. What would you like to learn about?'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: 'I understand your question. Let me help you with that concept. React components are the building blocks of React applications...'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="AI Study Assistant" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Get personalized help with your learning journey" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <PlatformCard className="h-[600px] flex flex-col">
              <div className="flex items-center gap-2 p-4 border-b">
                <Bot className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">
                  <LocalizedText text="AI Tutor Chat" />
                </h2>
                {lessonId && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Lesson Context
                  </span>
                )}
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question about your studies..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Quick Help" />
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <LocalizedText text="Explain Concept" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <LocalizedText text="Practice Problems" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LocalizedText text="Study Tips" />
                </Button>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Study Guidelines" />
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Ask specific questions for better help</p>
                <p>• Provide context about what you're studying</p>
                <p>• Let me know if you need examples</p>
                <p>• I can explain concepts step by step</p>
              </div>
            </PlatformCard>

            {lessonId && (
              <PlatformCard>
                <h3 className="font-semibold mb-3">
                  <LocalizedText text="Current Lesson" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  I have context about your current lesson and can provide targeted help.
                </p>
              </PlatformCard>
            )}
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
