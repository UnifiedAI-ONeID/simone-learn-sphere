
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Wand2, BookOpen, Target, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedCourse {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  targetAudience: string;
  modules: {
    title: string;
    description: string;
    lessons: string[];
    objectives: string[];
  }[];
  overallObjectives: string[];
}

interface PromptToCourseGeneratorProps {
  onCourseGenerated: (course: any) => void;
}

export const PromptToCourseGenerator: React.FC<PromptToCourseGeneratorProps> = ({
  onCourseGenerated,
}) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);

  const examplePrompts = [
    "Teach Python basics to high schoolers over 4 weeks",
    "Create a digital marketing course for small business owners",
    "Design a photography fundamentals workshop for beginners",
    "Build an advanced data science course for professionals"
  ];

  const generateCourse = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a course description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an expert educational content creator. Create a comprehensive course structure based on the user's prompt. 

      Return a JSON object with this exact structure:
      {
        "title": "Course Title",
        "description": "2-3 sentence course description",
        "duration": "X weeks",
        "difficulty": "Beginner/Intermediate/Advanced",
        "targetAudience": "Who this course is for",
        "modules": [
          {
            "title": "Module Title",
            "description": "Module description",
            "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"],
            "objectives": ["Objective 1", "Objective 2"]
          }
        ],
        "overallObjectives": ["Overall objective 1", "Overall objective 2"]
      }

      Create 4-6 modules with 3-5 lessons each. Make it practical and engaging.`;

      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          userRole: 'educator'
        }
      });

      if (error) throw error;

      // Parse the JSON response
      try {
        const jsonMatch = data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const courseData = JSON.parse(jsonMatch[0]);
          setGeneratedCourse(courseData);
          toast({
            title: "Success",
            description: "Course structure generated successfully!",
          });
        } else {
          throw new Error('Invalid JSON response');
        }
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        toast({
          title: "Error",
          description: "Failed to parse course structure. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error generating course:', error);
      toast({
        title: "Error",
        description: "Failed to generate course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyCourse = () => {
    if (!generatedCourse) return;

    // Convert generated course to internal format
    const courseStructure = {
      id: 'new',
      title: generatedCourse.title,
      description: generatedCourse.description,
      modules: generatedCourse.modules.map((module, moduleIndex) => ({
        id: `module-${moduleIndex + 1}`,
        title: module.title,
        description: module.description,
        order: moduleIndex + 1,
        lessons: module.lessons.map((lessonTitle, lessonIndex) => ({
          id: `lesson-${moduleIndex + 1}-${lessonIndex + 1}`,
          title: lessonTitle,
          content: `This lesson will cover: ${module.objectives.join(', ')}`,
          type: 'text' as const,
          order: lessonIndex + 1
        }))
      }))
    };

    onCourseGenerated(courseStructure);
    setGeneratedCourse(null);
    setPrompt('');
    
    toast({
      title: "Success",
      description: "Course structure applied! You can now customize it further.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Course Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your course idea
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Teach Python basics to high schoolers over 4 weeks"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Example prompts
            </label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={generateCourse}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          >
            {isGenerating ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Generating Course Structure...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Course Structure
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Course Preview */}
      {generatedCourse && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Generated Course Structure
              </CardTitle>
              <Button onClick={applyCourse} className="bg-gradient-to-r from-purple-600 to-blue-600">
                Apply Structure
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Overview */}
            <div>
              <h3 className="text-xl font-bold mb-2">{generatedCourse.title}</h3>
              <p className="text-gray-600 mb-4">{generatedCourse.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {generatedCourse.duration}
                </Badge>
                <Badge variant="outline">
                  <Target className="w-3 h-3 mr-1" />
                  {generatedCourse.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  {generatedCourse.targetAudience}
                </Badge>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h4 className="font-semibold mb-2">Learning Objectives</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {generatedCourse.overallObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>

            {/* Modules */}
            <div>
              <h4 className="font-semibold mb-3">Course Modules ({generatedCourse.modules.length})</h4>
              <div className="space-y-4">
                {generatedCourse.modules.map((module, index) => (
                  <Card key={index} className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{module.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          
                          <div className="mt-3 space-y-2">
                            <div>
                              <span className="text-xs font-medium text-gray-700">Lessons:</span>
                              <ul className="text-xs text-gray-600 ml-4 mt-1">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <li key={lessonIndex}>• {lesson}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <span className="text-xs font-medium text-gray-700">Objectives:</span>
                              <ul className="text-xs text-gray-600 ml-4 mt-1">
                                {module.objectives.map((objective, objIndex) => (
                                  <li key={objIndex}>• {objective}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
