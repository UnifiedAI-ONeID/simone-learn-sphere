
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock, Target, Wand2 } from 'lucide-react';

interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  moduleCount: number;
  tags: string[];
}

interface CourseTemplatesProps {
  onApplyTemplate: (template: any) => void;
}

export const CourseTemplates: React.FC<CourseTemplatesProps> = ({
  onApplyTemplate,
}) => {
  const templates: CourseTemplate[] = [
    {
      id: 'intro-course',
      title: 'Introduction Course',
      description: 'Perfect for foundational topics with gradual progression',
      duration: '4 weeks',
      difficulty: 'Beginner',
      moduleCount: 4,
      tags: ['Fundamentals', 'Step-by-step', 'Beginner-friendly']
    },
    {
      id: 'workshop',
      title: 'Hands-on Workshop',
      description: 'Intensive practical sessions with projects',
      duration: '2 weeks',
      difficulty: 'Intermediate',
      moduleCount: 6,
      tags: ['Practical', 'Projects', 'Interactive']
    },
    {
      id: 'masterclass',
      title: 'Masterclass Series',
      description: 'Deep dive into advanced topics',
      duration: '6 weeks',
      difficulty: 'Advanced',
      moduleCount: 8,
      tags: ['Advanced', 'Expert-level', 'Comprehensive']
    },
    {
      id: 'bootcamp',
      title: 'Intensive Bootcamp',
      description: 'Accelerated learning with daily challenges',
      duration: '3 weeks',
      difficulty: 'All levels',
      moduleCount: 15,
      tags: ['Intensive', 'Challenges', 'Fast-paced']
    }
  ];

  const applyTemplate = (template: CourseTemplate) => {
    // Generate course structure based on template
    const courseStructure = {
      id: 'new',
      title: `My ${template.title}`,
      description: template.description,
      modules: Array.from({ length: template.moduleCount }, (_, i) => ({
        id: `module-${i + 1}`,
        title: `Module ${i + 1}`,
        description: `Module ${i + 1} description`,
        order: i + 1,
        lessons: [
          {
            id: `lesson-${i + 1}-1`,
            title: `Introduction to Module ${i + 1}`,
            content: '',
            type: 'text' as const,
            order: 1
          }
        ]
      }))
    };
    
    onApplyTemplate(courseStructure);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
          Course Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="border border-gray-200 hover:border-purple-300 transition-colors">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {template.duration}
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {template.moduleCount} modules
                    </span>
                    <span className="flex items-center">
                      <Target className="w-3 h-3 mr-1" />
                      {template.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => applyTemplate(template)}
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
