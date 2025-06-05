
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, BookOpen, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const CourseCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    estimatedDuration: '',
    difficulty: 'Beginner' as const
  });

  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'AI-Powered Web Development',
      description: 'Learn to build modern web applications with AI assistance',
      category: 'Technology',
      estimatedDuration: '8 weeks',
      difficulty: 'Intermediate'
    }
  ]);

  const handleCreateCourse = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category || 'General',
      estimatedDuration: formData.estimatedDuration || '4 weeks',
      difficulty: formData.difficulty
    };

    setCourses(prev => [newCourse, ...prev]);
    setFormData({
      title: '',
      description: '',
      category: '',
      estimatedDuration: '',
      difficulty: 'Beginner'
    });
    setIsCreating(false);
    toast.success('Course created successfully!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Creator</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and manage your educational content</p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'New Course'}
        </Button>
      </div>

      {/* Course Creation Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Create New Course
            </CardTitle>
            <CardDescription>
              Fill in the details below to create your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Technology, Business, Art"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Estimated Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 4 weeks, 2 months"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCourse}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Create Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      <div className="grid gap-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Courses ({courses.length})
        </h3>
        
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h4>
                    <Badge className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.category}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.estimatedDuration}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.success(`Editing ${course.title}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => toast.success(`Managing lessons for ${course.title}`)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Manage Lessons
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
