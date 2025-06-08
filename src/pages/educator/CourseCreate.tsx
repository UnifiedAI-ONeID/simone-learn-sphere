import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Plus, Save, Eye } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const CourseCreate = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="Create New Course" />
        </h1>
        <p className="text-gray-600">
          <UnifiedLocalizedText text="Design and publish your course." />
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Basic Information" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Set the foundation for your course." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseTitle">
                  <UnifiedLocalizedText text="Course Title" />
                </Label>
                <Input
                  id="courseTitle"
                  placeholder="e.g., Introduction to React"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDescription">
                  <UnifiedLocalizedText text="Course Description" />
                </Label>
                <Textarea
                  id="courseDescription"
                  placeholder="Write a brief overview of your course"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCategory">
                  <UnifiedLocalizedText text="Category" />
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Course Settings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Course Settings" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Configure additional options for your course." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <UnifiedLocalizedText text="Publish Course" />
                  </div>
                </Label>
                <Switch id="isPublished" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allowEnrollment">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    <UnifiedLocalizedText text="Allow Enrollment" />
                  </div>
                </Label>
                <Switch id="allowEnrollment" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            <UnifiedLocalizedText text="Preview" />
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            <UnifiedLocalizedText text="Save Course" />
          </Button>
        </div>
      </div>
    </div>
  );
};

