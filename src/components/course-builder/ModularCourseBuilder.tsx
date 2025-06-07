
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Brain, BookOpen, Target, Wand2, GripVertical, Save, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import { useCourseDrafts } from '@/hooks/useCourseDrafts';
import { AIAssistantSidebar } from './AIAssistantSidebar';
import { ModuleCard } from './ModuleCard';
import { LessonComposer } from './LessonComposer';
import { CourseTemplates } from './CourseTemplates';

interface Course {
  id: string;
  title: string;
  description: string;
  modules: any[];
}

export const ModularCourseBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createCourse, updateCourse } = useCourses();
  const { debouncedSave, saving } = useCourseDrafts();
  
  const [course, setCourse] = useState<Course>({
    id: 'new',
    title: '',
    description: '',
    modules: []
  });
  
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const { modules, createModule, updateModule, createLesson, loading } = useModules(currentCourseId || '');
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'module' | 'lesson'>('overview');

  // Auto-save draft when course data changes
  useEffect(() => {
    if (course.title || course.description || modules.length > 0) {
      debouncedSave({
        ...course,
        modules: modules
      }, course.title);
    }
  }, [course, modules, debouncedSave]);

  const addModule = async () => {
    if (!currentCourseId) {
      // If no course exists yet, create one first
      const newCourse = await createCourse({
        title: course.title || 'Untitled Course',
        description: course.description || '',
      });
      
      if (newCourse) {
        setCurrentCourseId(newCourse.id);
        setCourse(prev => ({ ...prev, id: newCourse.id }));
        
        // Create the module
        await createModule({
          title: 'New Module',
          description: '',
        });
      }
    } else {
      await createModule({
        title: 'New Module',
        description: '',
      });
    }
  };

  const handleUpdateModule = async (moduleId: string, updates: any) => {
    await updateModule(moduleId, updates);
  };

  const handleAddLesson = async (moduleId: string) => {
    await createLesson(moduleId, {
      title: 'New Lesson',
      content: '',
      lesson_type: 'text',
    });
  };

  const saveCourse = async () => {
    if (!currentCourseId) {
      const newCourse = await createCourse({
        title: course.title || 'Untitled Course',
        description: course.description || '',
        is_published: true,
      });
      
      if (newCourse) {
        setCurrentCourseId(newCourse.id);
        setCourse(prev => ({ ...prev, id: newCourse.id }));
        toast({
          title: "Success",
          description: "Course created and published successfully!",
        });
      }
    } else {
      await updateCourse(currentCourseId, {
        title: course.title,
        description: course.description,
        is_published: true,
      });
      toast({
        title: "Success",
        description: "Course updated and published successfully!",
      });
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = ['Course'];
    if (selectedModule) {
      const module = modules.find(m => m.id === selectedModule);
      breadcrumbs.push(module?.title || 'Module');
    }
    if (selectedLesson) {
      const module = modules.find(m => m.id === selectedModule);
      const lesson = module?.lessons?.find(l => l.id === selectedLesson);
      breadcrumbs.push(lesson?.title || 'Lesson');
    }
    return breadcrumbs;
  };

  const applyTemplate = (template: any) => {
    setCourse(template);
    setCurrentCourseId(null); // Reset to create new course
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to create courses.</p>
      </div>
    );
  }

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
              {saving && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3 animate-spin" />
                  <span>Auto-saving...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                onClick={saveCourse}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                disabled={!course.title}
              >
                <Save className="w-4 h-4 mr-2" />
                Save & Publish Course
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
              <CourseTemplates onApplyTemplate={applyTemplate} />

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
                    <Button onClick={addModule} size="sm" disabled={loading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="mt-2">Loading modules...</p>
                    </div>
                  ) : modules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No modules yet. Add your first module to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {modules.map((module, index) => (
                        <ModuleCard
                          key={module.id}
                          module={{
                            id: module.id,
                            title: module.title,
                            description: module.description || '',
                            order_index: module.order_index,
                            lessons: module.lessons || [],
                          }}
                          index={index}
                          onUpdate={(updates) => handleUpdateModule(module.id, updates)}
                          onAddLesson={() => handleAddLesson(module.id)}
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
              <Button onClick={() => setCurrentView('overview')}>
                Back to Course Overview
              </Button>
            </div>
          )}

          {/* Lesson View */}
          {currentView === 'lesson' && selectedLesson && (
            <LessonComposer
              lesson={modules
                .find(m => m.id === selectedModule)
                ?.lessons?.find(l => l.id === selectedLesson)}
              onBack={() => setCurrentView('module')}
            />
          )}
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      {showAIAssistant && (
        <AIAssistantSidebar
          course={{
            ...course,
            modules: modules
          }}
          onClose={() => setShowAIAssistant(false)}
          onApplySuggestion={(suggestion) => {
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
