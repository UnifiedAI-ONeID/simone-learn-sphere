
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, GripVertical, Video, FileText, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Lesson {
  id?: string;
  title: string;
  content: string;
  lesson_type: 'text' | 'video' | 'quiz';
  video_url?: string;
  order_index: number;
  estimated_duration: number;
}

interface LessonEditorProps {
  courseId: string;
  lessons: Lesson[];
  onLessonsChange: (lessons: Lesson[]) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  courseId,
  lessons,
  onLessonsChange,
}) => {
  const { toast } = useToast();
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const addLesson = () => {
    const newLesson: Lesson = {
      title: '',
      content: '',
      lesson_type: 'text',
      order_index: lessons.length,
      estimated_duration: 30,
    };
    setEditingLesson(newLesson);
  };

  const saveLesson = async (lesson: Lesson) => {
    try {
      if (lesson.id) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update({
            title: lesson.title,
            content: lesson.content,
            lesson_type: lesson.lesson_type,
            video_url: lesson.video_url,
            estimated_duration: lesson.estimated_duration,
          })
          .eq('id', lesson.id);

        if (error) throw error;
      } else {
        // Create new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            course_id: courseId,
            title: lesson.title,
            content: lesson.content,
            lesson_type: lesson.lesson_type,
            video_url: lesson.video_url,
            order_index: lesson.order_index,
            estimated_duration: lesson.estimated_duration,
          })
          .select()
          .single();

        if (error) throw error;

        lesson.id = data.id;
      }

      const updatedLessons = lesson.id 
        ? lessons.map(l => l.id === lesson.id ? lesson : l)
        : [...lessons, lesson];

      onLessonsChange(updatedLessons);
      setEditingLesson(null);

      toast({
        title: "Success",
        description: "Lesson saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      const updatedLessons = lessons.filter(l => l.id !== lessonId);
      onLessonsChange(updatedLessons);

      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Lessons</h3>
        <Button onClick={addLesson}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => (
          <Card key={lesson.id || index} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    {getLessonIcon(lesson.lesson_type)}
                    <span className="font-medium">{lesson.title || 'Untitled Lesson'}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {lesson.lesson_type}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {lesson.estimated_duration} min
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingLesson(lesson)}
                  >
                    Edit
                  </Button>
                  {lesson.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteLesson(lesson.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lesson Editor Modal/Form */}
      {editingLesson && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>
              {editingLesson.id ? 'Edit Lesson' : 'Create New Lesson'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={editingLesson.title}
                onChange={(e) => setEditingLesson({
                  ...editingLesson,
                  title: e.target.value,
                })}
                placeholder="Lesson title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select
                  value={editingLesson.lesson_type}
                  onValueChange={(value: 'text' | 'video' | 'quiz') => 
                    setEditingLesson({
                      ...editingLesson,
                      lesson_type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                <Input
                  type="number"
                  value={editingLesson.estimated_duration}
                  onChange={(e) => setEditingLesson({
                    ...editingLesson,
                    estimated_duration: parseInt(e.target.value) || 0,
                  })}
                />
              </div>
            </div>

            {editingLesson.lesson_type === 'video' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Video URL</label>
                <Input
                  value={editingLesson.video_url || ''}
                  onChange={(e) => setEditingLesson({
                    ...editingLesson,
                    video_url: e.target.value,
                  })}
                  placeholder="https://..."
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={editingLesson.content}
                onChange={(e) => setEditingLesson({
                  ...editingLesson,
                  content: e.target.value,
                })}
                placeholder="Lesson content..."
                rows={6}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => saveLesson(editingLesson)}>
                <Save className="w-4 h-4 mr-2" />
                Save Lesson
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingLesson(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
