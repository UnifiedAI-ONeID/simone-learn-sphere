import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Play } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const CourseOverview = () => {
  const { id } = useParams();

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <UnifiedLocalizedText text="Course Overview" />
          </h1>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Track your progress and continue learning" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">
                <UnifiedLocalizedText text="Course Progress" />
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="w-full" />
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">8</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">3</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">4</div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">
                <UnifiedLocalizedText text="Course Modules" />
              </h2>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((module) => (
                  <div key={module} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Module {module}: Introduction to React</h3>
                        <p className="text-sm text-muted-foreground">4 lessons • 2 hours</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Course Details" />
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">8 hours total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">15 lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">1,234 students</span>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Quick Actions" />
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UnifiedLocalizedText text="Ask AI Tutor" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UnifiedLocalizedText text="Join Study Group" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UnifiedLocalizedText text="Course Forum" />
                </Button>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
