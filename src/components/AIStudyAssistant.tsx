
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, BookOpen, Target, Lightbulb, HelpCircle, Zap, Clock } from 'lucide-react';
import { useChatGPT } from '@/hooks/useChatGPT';
import { useToast } from '@/hooks/use-toast';

export const AIStudyAssistant = () => {
  const { sendMessage, isLoading } = useChatGPT();
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [practiceProblems, setPracticeProblems] = useState<string[]>([]);

  const studyTopics = [
    { name: 'JavaScript Fundamentals', difficulty: 'Beginner', color: 'bg-green-100 text-green-800' },
    { name: 'React Components', difficulty: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    { name: 'Async Programming', difficulty: 'Advanced', color: 'bg-purple-100 text-purple-800' },
    { name: 'CSS Grid & Flexbox', difficulty: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Node.js Basics', difficulty: 'Intermediate', color: 'bg-orange-100 text-orange-800' },
    { name: 'Database Design', difficulty: 'Advanced', color: 'bg-red-100 text-red-800' }
  ];

  const quickQuestions = [
    "Explain the difference between let, const, and var in JavaScript",
    "How do React hooks work?",
    "What is the difference between synchronous and asynchronous code?",
    "How does CSS Grid differ from Flexbox?",
    "What are the main principles of responsive design?"
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    try {
      const prompt = `As a learning assistant, provide a clear, educational explanation for this question: "${question}". 
      Include:
      1. A simple explanation
      2. Key concepts to understand
      3. A practical example
      4. Tips for remembering this concept
      
      Keep the explanation beginner-friendly but comprehensive.`;

      // For now, simulate the response
      const mockExplanation = `Great question! Let me break this down for you:

**Simple Explanation:**
This is a fundamental concept that helps you understand how modern web development works. The key is to think about it step by step.

**Key Concepts:**
• First principle: Understanding the basic structure
• Second principle: How it interacts with other components
• Third principle: Best practices for implementation

**Practical Example:**
Here's how you would use this in a real project:
\`\`\`javascript
// Example code here
const example = 'This demonstrates the concept';
\`\`\`

**Memory Tips:**
• Remember this by thinking of it like...
• A good analogy is...
• Practice this concept by...`;

      setExplanation(mockExplanation);
      setQuestion('');
      
      toast({
        title: "Explanation Generated!",
        description: "Your AI tutor has provided a detailed explanation.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePracticeProblems = async (topic: string) => {
    try {
      const prompt = `Generate 3 practice problems for "${topic}" that are educational and progressive in difficulty. 
      Make them practical and relevant to real-world development scenarios.`;

      // Mock practice problems
      const mockProblems = [
        `Create a simple ${topic} example that demonstrates the basic concepts`,
        `Build a more complex ${topic} solution that includes error handling`,
        `Design a real-world application feature using ${topic} best practices`
      ];

      setPracticeProblems(mockProblems);
      
      toast({
        title: "Practice Problems Ready!",
        description: `Generated 3 practice problems for ${topic}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate practice problems.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Study Assistant</h2>
          <p className="text-gray-600">Get personalized help with your learning journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                Ask Your AI Tutor
              </CardTitle>
              <CardDescription>
                Get detailed explanations for any programming or web development concept
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ask any question about programming, web development, or your courses..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="resize-none"
              />
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Quick Questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestion(q)}
                      className="text-left p-2 text-sm border rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAskQuestion}
                disabled={isLoading || !question.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Get Explanation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          {explanation && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  AI Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {explanation}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practice Problems */}
          {practiceProblems.length > 0 && (
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Practice Problems
                </CardTitle>
                <CardDescription>
                  Try these exercises to reinforce your learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practiceProblems.map((problem, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{problem}</p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Start Problem
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Study Topics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                Study Topics
              </CardTitle>
              <CardDescription>
                Generate practice problems for specific topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studyTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => generatePracticeProblems(topic.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">{topic.name}</h4>
                      <Badge className={topic.color}>
                        {topic.difficulty}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Generate Practice
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-2 bg-blue-50 rounded">
                  💡 <strong>Tip:</strong> Break complex topics into smaller concepts
                </div>
                <div className="p-2 bg-green-50 rounded">
                  🎯 <strong>Practice:</strong> Code along while learning new concepts
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  🔄 <strong>Review:</strong> Revisit topics you found challenging
                </div>
                <div className="p-2 bg-orange-50 rounded">
                  📝 <strong>Notes:</strong> Write explanations in your own words
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
