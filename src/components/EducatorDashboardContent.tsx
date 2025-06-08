import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  BarChart3,
  Star,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  AlertCircle,
  MessageCircle,
  Bot,
  Download,
  Eye,
  Edit,
  Send,
  Lightbulb,
  Sparkles,
  Rocket,
  Heart,
  Zap
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const EducatorDashboardContent = () => {
  // Simulate checking if educator has created any courses
  const hasCreatedCourses = false; // This should be determined by actual user data
  const totalRevenue = 0;
  const myCourses = [];

  // Show encouraging empty state for new educators
  if (!hasCreatedCourses && myCourses.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Message */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Rocket className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              <LocalizedText text="Welcome, Educator!" />
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              <LocalizedText text="Ready to inspire and educate the next generation of learners?" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              <LocalizedText text="Share your knowledge and passion with students worldwide" />
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-5 w-5 mr-2" />
              <LocalizedText text="Create Your First Course" />
            </Button>
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <LocalizedText text="Getting Started as an Educator" />
            </CardTitle>
            <CardDescription>
              <LocalizedText text="Follow these simple steps to launch your teaching journey" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <LocalizedText text="Plan Your Course" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <LocalizedText text="Use our AI Course Planner to structure your curriculum and learning objectives" />
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Bot className="h-4 w-4 mr-2" />
                    <LocalizedText text="Try AI Planner" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <LocalizedText text="Create Content" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <LocalizedText text="Build engaging lessons with our AI Content Generator or create from scratch" />
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <LocalizedText text="Generate Content" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <LocalizedText text="Publish & Share" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <LocalizedText text="Launch your course and start making an impact on students' lives" />
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <LocalizedText text="Course Builder" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <LocalizedText text="Earn Revenue" />
                  </CardTitle>
                  <CardDescription>
                    <LocalizedText text="Monetize your expertise" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="Set your own pricing and earn money from course enrollments while helping others learn" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <LocalizedText text="Global Reach" />
                  </CardTitle>
                  <CardDescription>
                    <LocalizedText text="Teach students worldwide" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="Connect with learners from around the globe and build an international community" />
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Bot className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    <LocalizedText text="AI-Powered Tools" />
                  </CardTitle>
                  <CardDescription>
                    <LocalizedText text="Smart content creation" />
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <LocalizedText text="Leverage AI to create course outlines, generate content, and enhance your teaching" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inspiration Section */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-red-500" />
              <LocalizedText text="Make a Difference" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                <LocalizedText text="Every course you create has the potential to change someone's life" />
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText text="Impact Lives" />
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">🌍</div>
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText text="Global Classroom" />
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">🚀</div>
                  <p className="text-sm text-muted-foreground">
                    <LocalizedText text="Limitless Growth" />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Keep existing code for educators with courses
  // ... keep existing code (for educators who have created courses)
  return (
    <div className="space-y-6">
      {/* Existing dashboard content for active educators */}
      {/* ... keep existing code */}
    </div>
  );
};
