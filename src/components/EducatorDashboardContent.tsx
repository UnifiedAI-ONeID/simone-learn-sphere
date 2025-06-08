
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Star,
  Heart,
  Trophy,
  Zap,
  PlusCircle,
  Edit,
  Eye,
  MessageSquare,
  Calendar,
  Rocket,
  Lightbulb,
  Bot,
  Sparkles
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const EducatorDashboardContent = () => {
  const navigate = useNavigate();
  
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
              <UnifiedLocalizedText text="Welcome, Educator!" />
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              <UnifiedLocalizedText text="Ready to inspire and educate the next generation of learners?" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              <UnifiedLocalizedText text="Share your knowledge and passion with students worldwide" />
            </p>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate('/educator/course/create')}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              <UnifiedLocalizedText text="Create Your First Course" />
            </Button>
          </CardContent>
        </Card>

        {/* Getting Started Steps */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <UnifiedLocalizedText text="Getting Started as an Educator" />
            </CardTitle>
            <CardDescription>
              <UnifiedLocalizedText text="Follow these simple steps to launch your teaching journey" />
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
                    <UnifiedLocalizedText text="Plan Your Course" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Use our AI Course Planner to structure your curriculum and learning objectives" />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/educator/ai-planner')}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    <UnifiedLocalizedText text="Try AI Planner" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <UnifiedLocalizedText text="Create Content" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Build engaging lessons with our AI Content Generator or create from scratch" />
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/educator/ai-content')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    <UnifiedLocalizedText text="Generate Content" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">
                    <UnifiedLocalizedText text="Publish & Share" />
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    <UnifiedLocalizedText text="Launch your course and start making an impact on students' lives" />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active educator dashboard with data would go here
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <UnifiedLocalizedText text="Total Courses" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
