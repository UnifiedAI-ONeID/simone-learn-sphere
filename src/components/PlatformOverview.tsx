
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Users, 
  Trophy, 
  DollarSign, 
  BarChart3,
  MessageSquare,
  Shield,
  Smartphone,
  Globe,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  Heart,
  Sparkles
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const PlatformOverview = () => {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced AI tutors and content generation to personalize every learning experience",
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
    },
    {
      icon: BookOpen,
      title: "Course Creation Tools",
      description: "Build engaging courses with our intuitive drag-and-drop builder and AI assistance",
      color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with learners and educators worldwide through forums and study groups",
      color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn badges, track streaks, and compete on leaderboards to stay motivated",
      color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into learning progress, engagement metrics, and performance data",
      color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
    },
    {
      icon: DollarSign,
      title: "Monetization Tools",
      description: "Flexible pricing models and revenue tracking for educators to monetize their expertise",
      color: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
    }
  ];

  const platformStats = [
    { label: "Active Learners", value: "50K+", icon: Users },
    { label: "Courses Available", value: "1,200+", icon: BookOpen },
    { label: "Countries Served", value: "120+", icon: Globe },
    { label: "Average Rating", value: "4.9★", icon: Star }
  ];

  const userTypes = [
    {
      type: "Students",
      icon: BookOpen,
      features: [
        "AI-powered personalized learning paths",
        "Interactive lessons and quizzes",
        "Progress tracking and achievements",
        "Community forums and study groups",
        "Mobile-optimized learning experience"
      ],
      color: "border-blue-200 dark:border-blue-800"
    },
    {
      type: "Educators",
      icon: Users,
      features: [
        "AI-assisted course creation",
        "Student analytics and insights",
        "Revenue tracking and payouts",
        "Live session hosting",
        "Marketing and promotion tools"
      ],
      color: "border-green-200 dark:border-green-800"
    },
    {
      type: "Administrators",
      icon: Shield,
      features: [
        "Platform-wide analytics dashboard",
        "User management and moderation",
        "Security monitoring and controls",
        "Revenue and payout management",
        "System configuration tools"
      ],
      color: "border-purple-200 dark:border-purple-800"
    }
  ];

  const benefits = [
    {
      title: "Democratizing Education",
      description: "Making quality education accessible to everyone, everywhere",
      icon: Globe
    },
    {
      title: "AI-Enhanced Learning",
      description: "Leveraging artificial intelligence to personalize and optimize learning outcomes",
      icon: Brain
    },
    {
      title: "Community-Driven",
      description: "Building connections between learners and educators worldwide",
      icon: Heart
    },
    {
      title: "Mobile-First Design",
      description: "Learn and teach seamlessly across all devices and platforms",
      icon: Smartphone
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
          <LocalizedText text="SimoneLabs Platform Overview" />
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          <LocalizedText text="A comprehensive AI-powered educational platform designed to democratize learning and empower educators worldwide through innovative technology and community-driven experiences." />
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {platformStats.map((stat, index) => (
          <Card key={index} className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
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
            <LocalizedText text="Core Platform Features" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Everything you need to create, deliver, and optimize educational experiences" />
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border">
              <CardHeader>
                <div className={`p-3 rounded-lg w-fit ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  <LocalizedText text={feature.title} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  <LocalizedText text={feature.description} />
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Types & Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <LocalizedText text="Built for Every User Type" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Tailored experiences and tools for students, educators, and administrators" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {userTypes.map((userType, index) => (
            <Card key={index} className={`${userType.color} hover:shadow-lg transition-shadow`}>
              <CardHeader className="text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <userType.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">
                  <LocalizedText text={userType.type} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        <LocalizedText text={feature} />
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Benefits */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <LocalizedText text="Why Choose SimoneLabs?" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Our mission-driven approach to transforming education through technology" />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    <LocalizedText text={benefit.title} />
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  <LocalizedText text={benefit.description} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            <LocalizedText text="Powered by Modern Technology" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <LocalizedText text="Built with cutting-edge tools and frameworks for optimal performance and scalability" />
          </p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground mb-1">React & TypeScript</h4>
                <p className="text-sm text-muted-foreground">Modern frontend framework</p>
              </div>
              <div>
                <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground mb-1">AI Integration</h4>
                <p className="text-sm text-muted-foreground">Advanced AI capabilities</p>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground mb-1">Secure Backend</h4>
                <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
              </div>
              <div>
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-foreground mb-1">Mobile Ready</h4>
                <p className="text-sm text-muted-foreground">Cross-platform support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section>
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              <LocalizedText text="Ready to Transform Education?" />
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              <LocalizedText text="Join thousands of educators and learners who are already using SimoneLabs to create amazing educational experiences." />
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
