
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, BookOpen, Users, Clock, Wand2 } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/hooks/use-toast';
import { EducatorAIAssistant } from './EducatorAIAssistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CourseCreator = () => {
  const { courses, loading, createCourse } = useCourses();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner' as const,
    estimated_duration: 4,
    tags: [] as string[]
  });

  const handleCreateCourse = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const success = await createCourse({
      title: formData.title,
      description: formData.description,
      difficulty_level: formData.difficulty_level,
      estimated_duration: formData.estimated_duration,
      tags: formData.tags,
    });

    if (success) {
      setFormData({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        estimated_duration: 4,
        tags: []
      });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Course created successfully!",
      });
    }
  };

  const handleAIAssistance = (suggestion: string) => {
    // Parse AI suggestion and populate form fields
    if (suggestion.includes('title:')) {
      const titleMatch = suggestion.match(/title:\s*([^\n]+)/i);
      if (titleMatch) {
        setFormData(prev => ({ ...prev, title: titleMatch[1].trim() }));
      }
    }
    if (suggestion.includes('description:')) {
      const descMatch = suggestion.match(/description:\s*([^\n]+)/i);
      if (descMatch) {
        setFormData(prev => ({ ...prev, description: descMatch[1].trim() }));
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Creator</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and manage your educational content with AI assistance</p>
        </div>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'New Course'}
        </Button>
      </div>

      {/* AI-Assisted Course Creation */}
      {isCreating && (
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Course</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Create New Course
                </CardTitle>
                <CardDescription>
                  Fill in the details below or use the AI Assistant tab for help
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="duration">Estimated Duration (weeks)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="52"
                      value={formData.estimated_duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <select
                      id="difficulty"
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value as any }))}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
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
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-assistant">
            <EducatorAIAssistant />
          </TabsContent>
        </Tabs>
      )}

      {/* Course List */}
      <div className="grid gap-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Courses ({courses.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Start creating your first course with AI assistance!</p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {course.title}
                      </h4>
                      <Badge className={getDifficultyColor(course.difficulty_level || 'beginner')}>
                        {course.difficulty_level || 'beginner'}
                      </Badge>
                      {!course.is_published && (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.enrollment_count || 0} students
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.estimated_duration || 4} weeks
                      </span>
                      {course.category && (
                        <span className="flex items-center">
                          <span className="w-4 h-4 mr-1">{course.category.icon}</span>
                          {course.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Manage Lessons
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
