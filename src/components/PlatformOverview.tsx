
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
  console.log('PlatformOverview: Component rendering');

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

  console.log('PlatformOverview: Co-founders data:', coFounders);

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <div className="text-center space-y-8">
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-gradient-to-br from-primary via-primary/90 to-secondary rounded-3xl shadow-2xl">
            <Sparkles className="h-16 w-16 text-primary-foreground animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="landing-hero-text landing-gradient-text">
            <LocalizedText text="SimoneLabs Platform" />
          </h1>
          <p className="landing-subtitle max-w-4xl mx-auto">
            <LocalizedText text="An AI-powered educational platform designed to democratize learning and empower educators worldwide." />
          </p>
        </div>
      </div>

      {/* Core Features */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            <LocalizedText text="Core Features" />
          </h2>
          <p className="landing-subtitle max-w-3xl mx-auto">
            <LocalizedText text="Everything you need to create and deliver amazing educational experiences" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <CardTitle className="landing-card-title">
                      <LocalizedText text={feature.title} />
                    </CardTitle>
                    <CardDescription className="landing-card-description">
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
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            <LocalizedText text="Meet Our Co-Founders" />
          </h2>
          <p className="landing-subtitle max-w-3xl mx-auto">
            <LocalizedText text="Passionate about transforming education through innovation" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {coFounders.map((founder, index) => {
            console.log('PlatformOverview: Rendering founder:', founder.name);
            return (
              <Card key={index} className="text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-10 space-y-6">
                  <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                    <AvatarImage src={founder.avatarUrl} alt={founder.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                      {founder.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      <LocalizedText text={founder.name} />
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      <LocalizedText text={founder.role} />
                    </p>
                    <p className="landing-card-description leading-relaxed">
                      <LocalizedText text={founder.description} />
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <Card className="landing-gradient text-primary-foreground border-0 shadow-2xl">
          <CardContent className="p-16 text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                <LocalizedText text="Ready to Transform Education?" />
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                <LocalizedText text="Join thousands of educators and learners using SimoneLabs to create amazing educational experiences." />
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <Play className="h-6 w-6 mr-3" />
                <LocalizedText text="Watch Demo" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                <LocalizedText text="Get Started Free" />
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
