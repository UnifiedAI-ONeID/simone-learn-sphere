
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ModularCourseBuilder } from '@/components/course-builder/ModularCourseBuilder';
import { PromptToCourseGenerator } from '@/components/course-builder/PromptToCourseGenerator';
import { Brain, BookOpen, Wand2 } from 'lucide-react';

const CourseBuilder = () => {
  const [generatedCourse, setGeneratedCourse] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <DashboardHeader 
        title="Course Builder"
        subtitle="Create engaging courses with AI assistance"
      />
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="generator" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Course Builder
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center">
              <Wand2 className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="space-y-6">
            <PromptToCourseGenerator onCourseGenerated={setGeneratedCourse} />
          </TabsContent>
          
          <TabsContent value="builder" className="space-y-6">
            <ModularCourseBuilder />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Course Templates</h2>
              <p className="text-gray-600">Pre-built course templates coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseBuilder;
