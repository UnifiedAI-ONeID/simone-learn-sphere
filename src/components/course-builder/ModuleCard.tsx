
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Brain, BookOpen, GripVertical, Edit2, Check, X } from 'lucide-react';

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

interface ModuleCardProps {
  module: Module;
  index: number;
  onUpdate: (updates: Partial<Module>) => void;
  onAddLesson: () => void;
  onSelect: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  index,
  onUpdate,
  onAddLesson,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(module.title);
  const [editDescription, setEditDescription] = useState(module.description);

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(module.title);
    setEditDescription(module.description);
    setIsEditing(false);
  };

  return (
    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {index + 1}
            </div>
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold"
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{module.title}</h3>
                {module.description && (
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={handleSave}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
            <div className="cursor-move">
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-xs">
              {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ~{module.lessons.length * 15} min
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={onAddLesson}>
              <Plus className="w-4 h-4 mr-1" />
              Add Lesson
            </Button>
            <Button size="sm" variant="outline">
              <Brain className="w-4 h-4 mr-1" />
              AI Suggest
            </Button>
            <Button size="sm" onClick={onSelect}>
              <BookOpen className="w-4 h-4 mr-1" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
