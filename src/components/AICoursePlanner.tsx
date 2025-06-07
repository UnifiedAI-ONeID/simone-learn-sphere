
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, BookOpen, Target, Wand2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CourseOutline {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  lessons: string[];
  objectives: string[];
}

export const AICoursePlanner = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseOutline, setCourseOutline] = useState<CourseOutline | null>(null);

  const generateCourseOutline = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a course topic",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Create a comprehensive course outline for "${topic}" targeting "${targetAudience || 'general learners'}". 
      Please provide:
      1. A catchy course title
      2. A compelling description (2-3 sentences)
      3. Estimated duration (in weeks)
      4. Difficulty level (beginner/intermediate/advanced)
      5. 6-8 lesson titles
      6. 4-5 key learning objectives
      
      Format your response as a JSON object with the following structure:
      {
        "title": "Course Title",
        "description": "Course description",
        "duration": "X weeks",
        "difficulty": "level",
        "lessons": ["Lesson 1", "Lesson 2", ...],
        "objectives": ["Objective 1", "Objective 2", ...]
      }`;

      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: {
          messages: [{ role: 'user', content: prompt }],
          userRole: 'educator'
        }
      });

      if (error) throw error;

      // Try to parse the JSON response
      try {
        const jsonMatch = data.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const outline = JSON.parse(jsonMatch[0]);
          setCourseOutline(outline);
          toast({
            title: "Success",
            description: "Course outline generated successfully!",
          });
        } else {
          throw new Error('Invalid JSON response');
        }
      } catch (parseError) {
        // Fallback to simple parsing if JSON parsing fails
        console.error('JSON parsing failed, using fallback');
        const outline: CourseOutline = {
          title: `Complete ${topic} Mastery Course`,
          description: `A comprehensive course designed to teach ${topic} from fundamentals to advanced concepts. Perfect for ${targetAudience || 'beginners and intermediate learners'} who want to master this subject.`,
          duration: '8 weeks',
          difficulty: 'intermediate',
          lessons: [
            `Introduction to ${topic}`,
            `Fundamentals and Core Concepts`,
            `Practical Applications`,
            `Advanced Techniques`,
            `Best Practices and Common Pitfalls`,
            `Real-world Projects`,
            `Industry Standards`,
            `Final Project and Assessment`
          ],
          objectives: [
            `Understand the fundamentals of ${topic}`,
            `Apply concepts in practical scenarios`,
            `Develop problem-solving skills`,
            `Create real-world projects`,
            `Master advanced techniques`
          ]
        };
        setCourseOutline(outline);
        toast({
          title: "Success",
          description: "Course outline generated successfully!",
        });
      }
    } catch (error) {
      console.error('Error generating course outline:', error);
      toast({
        title: "Error",
        description: "Failed to generate course outline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const quickTopics = [
    'Web Development',
    'Data Science',
    'Digital Marketing',
    'Graphic Design',
    'Photography',
    'Business Strategy',
    'Language Learning',
    'Financial Planning'
  ];

  return (
    <div className="space-y-6">
      {/* AI Course Planner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            AI Course Planner
          </CardTitle>
          <CardDescription>
            Let AI help you create a comprehensive course outline in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course Topic *</label>
            <Input
              placeholder="e.g., React Development, Digital Photography, Business Analytics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <Input
              placeholder="e.g., beginners, professionals, students"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Topics</label>
            <div className="flex flex-wrap gap-2">
              {quickTopics.map((quickTopic) => (
                <Badge
                  key={quickTopic}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50"
                  onClick={() => setTopic(quickTopic)}
                >
                  {quickTopic}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={generateCourseOutline}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Generating Course Outline...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Course Outline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Course Outline */}
      {courseOutline && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
                Generated Course Outline
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(courseOutline, null, 2))}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Course Title</h4>
                <p className="text-sm bg-gray-50 p-2 rounded">{courseOutline.title}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Duration & Difficulty</h4>
                <div className="flex space-x-2">
                  <Badge variant="outline">{courseOutline.duration}</Badge>
                  <Badge variant="outline">{courseOutline.difficulty}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Description</h4>
              <p className="text-sm bg-gray-50 p-3 rounded">{courseOutline.description}</p>
            </div>

            {/* Learning Objectives */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Learning Objectives
              </h4>
              <ul className="space-y-1">
                {courseOutline.objectives.map((objective, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-purple-600 mr-2">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lesson Plan */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                Lesson Plan ({courseOutline.lessons.length} lessons)
              </h4>
              <div className="grid gap-2">
                {courseOutline.lessons.map((lesson, index) => (
                  <div key={index} className="flex items-center text-sm bg-purple-50 p-2 rounded">
                    <span className="bg-purple-100 text-purple-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    {lesson}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Use This Outline to Create Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
