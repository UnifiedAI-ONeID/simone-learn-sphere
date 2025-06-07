
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, X, HelpCircle, BookOpen } from 'lucide-react';
import { AITutor } from '@/components/AITutor';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

export const ChatPopup: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'general' | 'tutor'>('general');
  
  // Detect if user is in a lesson or quiz context
  const isInLesson = location.pathname.includes('/lesson') || location.pathname.includes('/course');
  const isInQuiz = location.pathname.includes('/quiz') || location.pathname.includes('/assessment');
  
  // Extract lesson ID from URL if available
  const lessonId = React.useMemo(() => {
    const match = location.pathname.match(/\/lesson\/([^\/]+)/);
    return match ? match[1] : undefined;
  }, [location.pathname]);

  if (!user) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-40"
          size="sm"
        >
          {isInLesson || isInQuiz ? (
            <Brain className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
          {(isInLesson || isInQuiz) && (
            <Badge className="absolute -top-2 -left-2 bg-green-500 text-white text-xs px-1">
              {isInQuiz ? 'Quiz' : 'Lesson'}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50">
          <Card className="h-full shadow-2xl border-2 border-purple-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {mode === 'tutor' ? 'AI Tutor' : 'AI Assistant'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {(isInLesson || isInQuiz) && (
                    <div className="flex space-x-1">
                      <Button
                        variant={mode === 'general' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMode('general')}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      <Button
                        variant={mode === 'tutor' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMode('tutor')}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        Tutor
                      </Button>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {mode === 'tutor' && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {isInQuiz && (
                    <Badge variant="outline" className="text-xs">
                      <HelpCircle className="w-3 h-3 mr-1" />
                      Quiz Mode - No Direct Answers
                    </Badge>
                  )}
                  {isInLesson && !isInQuiz && (
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Lesson Context
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-0 h-[calc(100%-80px)]">
              {mode === 'tutor' ? (
                <AITutor 
                  lessonId={lessonId}
                  quizContext={isInQuiz}
                  className="h-full border-0 shadow-none"
                />
              ) : (
                <div className="h-full p-4 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>General AI chat coming soon!</p>
                    <p className="text-sm mt-2">Switch to Tutor mode for learning assistance.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
