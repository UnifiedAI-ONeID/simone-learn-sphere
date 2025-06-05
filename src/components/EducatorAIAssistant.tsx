
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Lightbulb, BookOpen, Users, Target } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIResponse {
  id: string;
  query: string;
  response: string;
  category: string;
  timestamp: Date;
}

export const EducatorAIAssistant = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([
    {
      id: '1',
      query: 'How can I make my programming course more engaging?',
      response: 'Consider adding interactive coding challenges, real-world projects, peer programming sessions, and gamification elements like progress badges. Break complex topics into bite-sized lessons with immediate practice opportunities.',
      category: 'Course Design',
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const quickPrompts = [
    {
      icon: BookOpen,
      title: 'Course Structure',
      prompt: 'Help me create a course outline for [topic]',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      icon: Users,
      title: 'Student Engagement',
      prompt: 'How can I increase student engagement in my course?',
      color: 'bg-green-100 text-green-800'
    },
    {
      icon: Target,
      title: 'Learning Objectives',
      prompt: 'Help me define clear learning objectives for [lesson topic]',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: Lightbulb,
      title: 'Activity Ideas',
      prompt: 'Suggest interactive activities for teaching [subject]',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const handleAskAI = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    
    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const newResponse: AIResponse = {
        id: Date.now().toString(),
        query: query,
        response: generateAIResponse(query),
        category: categorizeQuery(query),
        timestamp: new Date()
      };
      
      setResponses(prev => [newResponse, ...prev]);
      setQuery('');
      setIsLoading(false);
      toast.success('AI response generated!');
    }, 2000);
  };

  const generateAIResponse = (query: string): string => {
    const responses = [
      "Great question! Here are some evidence-based strategies you can implement: Start with clear learning objectives, use active learning techniques, provide regular feedback, and create opportunities for peer interaction. Consider incorporating multimedia content and real-world applications to make the material more relatable.",
      "I recommend breaking this down into smaller, digestible modules. Use the 'chunking' principle - limit each lesson to 10-15 minutes of focused content. Add interactive elements like quizzes, discussions, or hands-on exercises every few minutes to maintain engagement.",
      "Consider using a flipped classroom approach where students review content beforehand and use class time for discussion and problem-solving. This increases active participation and allows for personalized support during complex topics.",
      "To improve retention, implement spaced repetition techniques. Review key concepts multiple times across different lessons, use varied examples, and encourage students to teach concepts to peers - this strengthens their understanding significantly."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const categorizeQuery = (query: string): string => {
    const categories = ['Course Design', 'Student Engagement', 'Assessment', 'Technology Integration', 'Pedagogy'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Course Design': 'bg-blue-100 text-blue-800',
      'Student Engagement': 'bg-green-100 text-green-800',
      'Assessment': 'bg-purple-100 text-purple-800',
      'Technology Integration': 'bg-orange-100 text-orange-800',
      'Pedagogy': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Teaching Assistant</h2>
          <p className="text-gray-600 dark:text-gray-300">Get personalized guidance for your courses</p>
        </div>
      </div>

      {/* Quick Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Start Prompts</CardTitle>
          <CardDescription>Click on any prompt to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setQuery(prompt.prompt)}
                className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${prompt.color}`}>
                    <prompt.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{prompt.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{prompt.prompt}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ask AI */}
      <Card>
        <CardHeader>
          <CardTitle>Ask Your AI Assistant</CardTitle>
          <CardDescription>
            Get help with course creation, teaching strategies, and student engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask me anything about course creation, teaching methods, student engagement, or educational best practices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button 
            onClick={handleAskAI}
            disabled={isLoading || !query.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                AI is thinking...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Ask AI Assistant
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Responses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent AI Conversations ({responses.length})
        </h3>
        
        {responses.map((response) => (
          <Card key={response.id} className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(response.category)}>
                        {response.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {response.timestamp.toLocaleDateString()} at {response.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        <strong>Your Question:</strong> {response.query}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>AI Response:</strong> {response.response}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
