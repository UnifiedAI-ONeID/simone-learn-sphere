
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Plus, Save, Eye } from 'lucide-react';

export const CourseCreate = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Create New Course
        </h1>
        <p className="text-gray-600">
          Design and publish your course.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Basic Information
            </CardTitle>
            <CardDescription>
              Set the foundation for your course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseTitle">
                  Course Title
                </Label>
                <Input
                  id="courseTitle"
                  placeholder="e.g., Introduction to React"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDescription">
                  Course Description
                </Label>
                <Textarea
                  id="courseDescription"
                  placeholder="Write a brief overview of your course"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCategory">
                  Category
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
              Course Settings
            </CardTitle>
            <CardDescription>
              Configure additional options for your course.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Publish Course
                  </div>
                </Label>
                <Switch id="isPublished" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allowEnrollment">
                  <div className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Allow Enrollment
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
            Preview
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Course
          </Button>
        </div>
      </div>
    </div>
  );
};
