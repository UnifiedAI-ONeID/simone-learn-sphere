
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  BookOpen, 
  Users, 
  Trophy,
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const PlatformOverview = () => {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized education with advanced AI tutors and content generation"
    },
    {
      icon: BookOpen,
      title: "Course Creation Tools",
      description: "Build engaging courses with intuitive tools and AI assistance"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners and educators worldwide"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn badges, track progress, and stay motivated"
    }
  ];

  const platformStats = [
    { label: "Active Learners", value: "50K+" },
    { label: "Courses Available", value: "1,200+" },
    { label: "Countries Served", value: "120+" },
    { label: "Average Rating", value: "4.9★" }
  ];

  const coFounders = [
    {
      name: "Fiona Wong",
      role: "Co-Founder & CEO",
      avatar: "FW",
      avatarUrl: "/lovable-uploads/d6a21c1b-8b9b-4811-a5eb-eafac22bca5f.png",
      description: "Passionate about democratizing education and empowering educators worldwide"
    },
    {
      name: "Simon Luke",
      role: "Co-Founder & CTO",
      avatar: "SL",
      avatarUrl: "/lovable-uploads/7a68d4b0-5778-4fc6-bd9d-8d45d0d83da0.png",
      description: "Building innovative AI-powered solutions for the future of learning"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-primary to-primary/80 rounded-2xl">
            <Sparkles className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          <LocalizedText text="SimoneLabs Platform" />
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <LocalizedText text="An AI-powered educational platform designed to democratize learning and empower educators worldwide." />
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <Card key={index} className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Core Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <LocalizedText text="Core Features" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Everything you need to create and deliver amazing educational experiences" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      <LocalizedText text={feature.title} />
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                      <LocalizedText text={feature.description} />
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Co-Founders Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <LocalizedText text="Meet Our Co-Founders" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Passionate about transforming education through innovation" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {coFounders.map((founder, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={founder.avatarUrl} alt={founder.name} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {founder.avatar}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  <LocalizedText text={founder.name} />
                </h3>
                <p className="text-primary font-medium mb-3">
                  <LocalizedText text={founder.role} />
                </p>
                <p className="text-muted-foreground text-sm">
                  <LocalizedText text={founder.description} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <LocalizedText text="Ready to Transform Education?" />
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              <LocalizedText text="Join thousands of educators and learners using SimoneLabs to create amazing educational experiences." />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Play className="h-5 w-5 mr-2" />
                <LocalizedText text="Watch Demo" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <LocalizedText text="Get Started Free" />
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
