
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, MessageCircle, BookOpen } from 'lucide-react';

export const LessonView = () => {
  const { id, moduleId, lessonId } = useParams();

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Course</span>
            <span>•</span>
            <span>Module {moduleId}</span>
            <span>•</span>
            <span>Lesson {lessonId}</span>
          </div>
          <h1 className="text-3xl font-bold">
            Introduction to React Components
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PlatformCard className="p-0">
              <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Video Content Area</p>
                  <p className="text-sm opacity-75">Lesson video would be displayed here</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Lesson Progress
                  </h2>
                  <span className="text-sm text-muted-foreground">75% complete</span>
                </div>
                <Progress value={75} className="mb-4" />
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button size="sm">
                    Mark Complete
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="text-lg font-semibold mb-4">
                Lesson Content
              </h3>
              <div className="prose max-w-none">
                <p>
                  In this lesson, you'll learn about React components and how they form the building blocks of React applications. 
                  Components allow you to split the UI into independent, reusable pieces.
                </p>
                <h4>What you'll learn:</h4>
                <ul>
                  <li>What are React components</li>
                  <li>Functional vs Class components</li>
                  <li>Props and component composition</li>
                  <li>Best practices for component design</li>
                </ul>
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                Module Lessons
              </h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((lesson) => (
                  <div key={lesson} className={`p-3 rounded border ${lesson === 2 ? 'bg-primary/10 border-primary' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lesson {lesson}</span>
                      {lesson < 2 && <span className="text-xs text-green-600">✓</span>}
                      {lesson === 2 && <span className="text-xs text-primary">Current</span>}
                    </div>
                  </div>
                ))}
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                Need Help?
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask AI Tutor
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Discussion Forum
                </Button>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
