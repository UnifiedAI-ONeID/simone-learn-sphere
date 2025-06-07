
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Eye, Video, FileText, HelpCircle, Target } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz' | 'assignment';
  order: number;
}

interface LessonComposerProps {
  lesson?: Lesson;
  onBack: () => void;
}

export const LessonComposer: React.FC<LessonComposerProps> = ({
  lesson,
  onBack,
}) => {
  const [lessonData, setLessonData] = useState<Lesson>(
    lesson || {
      id: 'new',
      title: 'New Lesson',
      content: '',
      type: 'text',
      order: 1,
    }
  );
  const [isPreview, setIsPreview] = useState(false);

  const lessonTypes = [
    { value: 'text', label: 'Text Content', icon: FileText },
    { value: 'video', label: 'Video Lesson', icon: Video },
    { value: 'quiz', label: 'Quiz', icon: HelpCircle },
    { value: 'assignment', label: 'Assignment', icon: Target },
  ];

  const handleSave = () => {
    // Save lesson logic would go here
    console.log('Saving lesson:', lessonData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lessonData.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {lessonTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={lessonData.type === type.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setLessonData(prev => ({ ...prev, type: type.value as any }))}
                >
                  <type.icon className="w-3 h-3 mr-1" />
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      {isPreview ? (
        <Card>
          <CardHeader>
            <CardTitle>{lessonData.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {lessonData.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Lesson Title</label>
                  <Input
                    value={lessonData.title}
                    onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={lessonData.content}
                    onChange={(e) => setLessonData(prev => ({ ...prev, content: e.target.value }))}
                    rows={15}
                    placeholder="Write your lesson content here..."
                  />
                </div>

                {/* Media Drop Zone */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="text-gray-500">
                    <Video className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Drop media files here or click to upload</p>
                    <p className="text-xs text-gray-400">Videos, images, PDFs, and more</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Summarize Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Generate Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Add Objectives
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lesson Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Estimated Duration (minutes)</label>
                  <Input type="number" placeholder="15" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Level</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
