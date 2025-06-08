import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface LandingPageAssistantProps {
  className?: string;
}

export const LandingPageAssistant: React.FC<LandingPageAssistantProps> = ({ className }) => {
  const [messages, setMessages] = useState<
    { role: 'assistant' | 'user'; content: string }[]
  >([
    {
      role: 'assistant',
      content:
        "Hi, I'm your AI assistant! How can I help you learn more about our platform today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: input,
      },
    ]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `That's a great question! Let me get back to you with a detailed answer. (This is a demo, so the response is simulated.)`,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <UnifiedLocalizedText text="AI Assistant" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Your personal guide to our platform" />
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 bg-secondary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-center">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            disabled={isLoading}
            className="mr-2"
          />
          <Button onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Send" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
