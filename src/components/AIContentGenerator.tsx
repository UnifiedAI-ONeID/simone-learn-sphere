
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, FileText, BookOpen, HelpCircle, Target, Copy, Download, Wand2 } from 'lucide-react';
import { useChatGPT } from '@/hooks/useChatGPT';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  type: string;
  title: string;
  content: string;
  metadata: {
    difficulty: string;
    duration: string;
    objectives: string[];
  };
}

export const AIContentGenerator = () => {
  const { sendMessage, isLoading } = useChatGPT();
  const { toast } = useToast();
  const [contentType, setContentType] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const contentTypes = [
    { value: 'lesson', label: 'Lesson Plan', icon: BookOpen, description: 'Complete lesson with objectives and activities' },
    { value: 'quiz', label: 'Quiz/Assessment', icon: HelpCircle, description: 'Multiple choice and practical questions' },
    { value: 'assignment', label: 'Assignment', icon: Target, description: 'Project-based learning assignment' },
    { value: 'explanation', label: 'Concept Explanation', icon: FileText, description: 'Detailed explanation of a topic' },
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const durations = ['15 minutes', '30 minutes', '1 hour', '2 hours', 'Half day', 'Full day'];

  const generateContent = async () => {
    if (!contentType || !topic || !difficulty) {
      toast({
        title: "Missing Information",
        description: "Please fill in the content type, topic, and difficulty level.",
        variant: "destructive",
      });
      return;
    }

    try {
      const prompt = `Generate educational content with these specifications:
      
      Content Type: ${contentType}
      Topic: ${topic}
      Difficulty Level: ${difficulty}
      Duration: ${duration || 'Not specified'}
      Additional Requirements: ${additionalRequirements || 'None'}
      
      Please create comprehensive ${contentType} content that includes:
      1. Clear learning objectives
      2. Structured content/activities
      3. Assessment criteria (if applicable)
      4. Additional resources or tips
      
      Format the response as detailed educational content suitable for ${difficulty} level learners.`;

      // Mock generated content for demonstration
      const mockContent: GeneratedContent = {
        type: contentType,
        title: `${topic} - ${difficulty} Level ${contentType}`,
        content: `# ${topic} Learning Content

## Learning Objectives
By the end of this ${contentType}, students will be able to:
- Understand the fundamental concepts of ${topic}
- Apply ${topic} principles in practical scenarios
- Analyze and solve problems using ${topic} knowledge
- Create projects that demonstrate ${topic} mastery

## Content Overview

### Introduction (10 minutes)
- Overview of ${topic} and its importance
- Real-world applications and examples
- What students will learn today

### Main Content (${duration || '30 minutes'})
- Core concepts and terminology
- Step-by-step explanations
- Interactive examples and demonstrations
- Hands-on practice opportunities

### Practice Activities
- Guided exercises to reinforce learning
- Problem-solving scenarios
- Collaborative activities
- Individual reflection time

### Assessment
- Knowledge check questions
- Practical application tasks
- Peer review activities
- Self-assessment rubric

## Additional Resources
- Recommended reading materials
- Online tutorials and videos
- Practice exercises for homework
- Community forums and support

## Teacher Notes
- Common student misconceptions
- Troubleshooting tips
- Extension activities for advanced learners
- Accommodation suggestions

${additionalRequirements ? `\n## Special Requirements\n${additionalRequirements}` : ''}`,
        metadata: {
          difficulty,
          duration: duration || '30 minutes',
          objectives: [
            `Master ${topic} fundamentals`,
            'Apply concepts practically',
            'Solve real-world problems',
            'Create meaningful projects'
          ]
        }
      };

      setGeneratedContent(mockContent);
      
      toast({
        title: "Content Generated Successfully!",
        description: `Your ${contentType} for ${topic} is ready to use.`,
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const downloadContent = () => {
    if (!generatedContent) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedContent.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${generatedContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Content saved to your device.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
          <p className="text-gray-600">Create lesson plans, quizzes, and assignments with AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Specifications</CardTitle>
              <CardDescription>
                Define what type of educational content you need
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type *</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <type.icon className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Topic/Subject *</label>
                <Input
                  placeholder="e.g., React Hooks, CSS Grid, JavaScript Arrays"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level *</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur} value={dur}>
                        {dur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Requirements</label>
                <Textarea
                  placeholder="Any specific requirements, learning objectives, or constraints..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={generateContent}
                disabled={isLoading || !contentType || !topic || !difficulty}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Content Type Info */}
          {contentType && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">About This Content Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {contentTypes.find(t => t.value === contentType)?.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Generated Content */}
        <div className="lg:col-span-2">
          {generatedContent ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{generatedContent.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{generatedContent.metadata.difficulty}</Badge>
                      <Badge variant="outline">{generatedContent.metadata.duration}</Badge>
                      <Badge variant="outline">{generatedContent.type}</Badge>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedContent.content)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadContent}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                    {generatedContent.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Brain className="w-16 h-16 text-gray-300 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-500">Ready to Generate Content</h3>
                  <p className="text-gray-400">Fill out the form and click generate to create your educational content</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
