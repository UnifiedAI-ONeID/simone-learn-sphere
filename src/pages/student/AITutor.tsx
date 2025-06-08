
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { AIChat } from '@/components/AIChat';
import { BookOpen, HelpCircle, Target, Lightbulb } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileAIChat } from '@/components/mobile/MobileAIChat';

export const AITutor = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  const isMobile = useIsMobile();
  const [showMobileChat, setShowMobileChat] = useState(false);

  const contextPrompt = lessonId 
    ? `You are an AI tutor helping with lesson ${lessonId}. Provide educational guidance and explanations.`
    : 'You are an AI tutor. Help students learn by providing clear explanations and guidance.';

  const quickActions = [
    {
      title: 'Explain Concept',
      description: 'Get detailed explanations of complex topics',
      icon: <BookOpen className="h-4 w-4" />,
      prompt: 'Can you explain this concept in simple terms?'
    },
    {
      title: 'Practice Problems',
      description: 'Get practice questions and exercises',
      icon: <Target className="h-4 w-4" />,
      prompt: 'Can you give me some practice problems on this topic?'
    },
    {
      title: 'Study Tips',
      description: 'Get personalized study strategies',
      icon: <Lightbulb className="h-4 w-4" />,
      prompt: 'What are some effective study strategies for this subject?'
    },
    {
      title: 'Help with Questions',
      description: 'Get help understanding specific questions',
      icon: <HelpCircle className="h-4 w-4" />,
      prompt: 'I need help understanding this question:'
    }
  ];

  if (isMobile) {
    return (
      <PlatformLayout>
        <div className="p-4 space-y-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              <LocalizedText text="AI Study Assistant" />
            </h1>
            <p className="text-muted-foreground text-sm">
              <LocalizedText text="Get personalized help with your learning journey" />
            </p>
          </div>

          <PlatformCard>
            <div className="space-y-3">
              <h2 className="font-semibold">
                <LocalizedText text="Quick Actions" />
              </h2>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setShowMobileChat(true)}
                >
                  <div className="flex items-start gap-3">
                    {action.icon}
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </PlatformCard>

          <Button 
            className="w-full" 
            onClick={() => setShowMobileChat(true)}
          >
            <LocalizedText text="Start AI Chat" />
          </Button>

          <MobileAIChat
            isOpen={showMobileChat}
            onClose={() => setShowMobileChat(false)}
            context={contextPrompt}
            placeholder="Ask your study question..."
          />
        </div>
      </PlatformLayout>
    );
  }

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
          {lessonId && (
            <div className="mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Lesson Context: {lessonId}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <AIChat
              className="h-[600px]"
              systemPrompt={contextPrompt}
              placeholder="Ask a question about your studies..."
            />
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Quick Actions" />
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-auto py-2 px-3"
                  >
                    <div className="flex items-start gap-2">
                      {action.icon}
                      <div className="text-left">
                        <div className="font-medium text-xs">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
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
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
