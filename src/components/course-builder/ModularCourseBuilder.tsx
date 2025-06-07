
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Brain, BookOpen, Target, Wand2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIAssistantSidebar } from './AIAssistantSidebar';
import { ModuleCard } from './ModuleCard';
import { LessonComposer } from './LessonComposer';
import { CourseTemplates } from './CourseTemplates';

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz' | 'assignment';
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export const ModularCourseBuilder = () => {
  const { toast } = useToast();
  const [course, setCourse] = useState<Course>({
    id: 'new',
    title: '',
    description: '',
    modules: []
  });
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'module' | 'lesson'>('overview');

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: 'New Module',
      description: '',
      order: course.modules.length + 1,
      lessons: []
    };
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId ? { ...m, ...updates } : m
      )
    }));
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: 'New Lesson',
      content: '',
      type: 'text',
      order: 1
    };
    
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m => 
        m.id === moduleId 
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      )
    }));
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = ['Course'];
    if (selectedModule) {
      const module = course.modules.find(m => m.id === selectedModule);
      breadcrumbs.push(module?.title || 'Module');
    }
    if (selectedLesson) {
      const module = course.modules.find(m => m.id === selectedModule);
      const lesson = module?.lessons.find(l => l.id === selectedLesson);
      breadcrumbs.push(lesson?.title || 'Lesson');
    }
    return breadcrumbs;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className={`flex-1 ${showAIAssistant ? 'mr-80' : ''} transition-all duration-300`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={index}>
                    <span>{crumb}</span>
                    {index < getBreadcrumbs().length - 1 && <span>/</span>}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {course.title || 'New Course'}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                Save Course
              </Button>
            </div>
          </div>

          {/* Course Overview */}
          {currentView === 'overview' && (
            <div className="space-y-6">
              {/* Course Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>
                    Basic information about your course
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Course Title</label>
                    <Input
                      value={course.title}
                      onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter course title..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={course.description}
                      onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what students will learn..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Templates */}
              <CourseTemplates onApplyTemplate={(template) => setCourse(template)} />

              {/* Modules */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Course Modules</CardTitle>
                      <CardDescription>
                        Organize your content into modules
                      </CardDescription>
                    </div>
                    <Button onClick={addModule} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {course.modules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No modules yet. Add your first module to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {course.modules.map((module, index) => (
                        <ModuleCard
                          key={module.id}
                          module={module}
                          index={index}
                          onUpdate={(updates) => updateModule(module.id, updates)}
                          onAddLesson={() => addLesson(module.id)}
                          onSelect={() => {
                            setSelectedModule(module.id);
                            setCurrentView('module');
                          }}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Module View */}
          {currentView === 'module' && selectedModule && (
            <div>
              {/* Module content would go here */}
              <Button onClick={() => setCurrentView('overview')}>
                Back to Course Overview
              </Button>
            </div>
          )}

          {/* Lesson View */}
          {currentView === 'lesson' && selectedLesson && (
            <LessonComposer
              lesson={course.modules
                .find(m => m.id === selectedModule)
                ?.lessons.find(l => l.id === selectedLesson)}
              onBack={() => setCurrentView('module')}
            />
          )}
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <AIAssistantSidebar
          course={course}
          onClose={() => setShowAIAssistant(false)}
          onApplySuggestion={(suggestion) => {
            // Apply AI suggestions to course
            toast({
              title: "AI Suggestion Applied",
              description: "The AI suggestion has been applied to your course.",
            });
          }}
        />
      )}
    </div>
  );
};
