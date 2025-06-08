
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Progress } from '@/components/ui/progress';
import { Users, Eye, CheckCircle, TrendingUp } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const CourseAnalytics = () => {
  const { id } = useParams();

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <UnifiedLocalizedText text="Course Analytics" />
          </h1>
          <p className="text-muted-foreground">
            <UnifiedLocalizedText text="Track student engagement and course performance" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>

          <PlatformCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Views</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </PlatformCard>
        </div>

        <PlatformCard>
          <h2 className="text-xl font-semibold mb-4">Module Performance</h2>
          <div className="space-y-4">
            {[
              { name: "Module 1: Introduction", completion: 85, students: 133 },
              { name: "Module 2: Components", completion: 72, students: 112 },
              { name: "Module 3: State Management", completion: 58, students: 90 },
              { name: "Module 4: Advanced Topics", completion: 34, students: 53 }
            ].map((module, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{module.name}</span>
                  <span className="text-sm text-muted-foreground">{module.students} students</span>
                </div>
                <Progress value={module.completion} className="h-2" />
                <div className="text-sm text-muted-foreground">{module.completion}% completion rate</div>
              </div>
            ))}
          </div>
        </PlatformCard>
      </div>
    </PlatformLayout>
  );
};
