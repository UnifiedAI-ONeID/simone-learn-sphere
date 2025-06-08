
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Save, Eye, Settings } from 'lucide-react';

export const CourseEditor = () => {
  const { id } = useParams();

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Course Editor
              </h1>
              <p className="text-muted-foreground">
                Edit and manage your course content
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">Course Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Course Title</label>
                  <Input defaultValue="React Fundamentals" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course Description</label>
                  <Textarea 
                    defaultValue="Learn the fundamentals of React development"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <PlatformCard>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Course Modules</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((module) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h3 className="font-medium">Module {module}: Introduction to React</h3>
                    <p className="text-sm text-muted-foreground">4 lessons • 2 hours</p>
                  </div>
                ))}
              </div>
            </PlatformCard>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PlatformCard>
              <h2 className="text-xl font-semibold mb-4">Course Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium">Published</label>
                    <p className="text-sm text-muted-foreground">Make course visible to students</p>
                  </div>
                  <Settings className="h-4 w-4" />
                </div>
              </div>
            </PlatformCard>
          </TabsContent>
        </Tabs>
      </div>
    </PlatformLayout>
  );
};
