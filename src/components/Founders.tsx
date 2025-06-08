
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { OptimizedLocalizedText } from '@/components/OptimizedLocalizedText';
import { Linkedin, Twitter } from 'lucide-react';

const foundersData = [
  {
    id: 1,
    name: "Fiona Wong",
    role: "CEO & Co-Founder",
    bio: "Former Stanford AI researcher with 15+ years in educational technology. Led development of adaptive learning algorithms at major tech companies.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 2,
    name: "Simon Luke",
    role: "CTO & Co-Founder", 
    bio: "MIT computer science graduate and former lead engineer at educational platforms. Expert in scalable learning systems and AI integration.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    twitter: "#"
  }
];

export const Founders: React.FC = () => {
  return (
    <section className="py-16 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <OptimizedLocalizedText text="Meet Our Founders" priority={2} />
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            <OptimizedLocalizedText 
              text="Passionate educators and technologists united by a vision to democratize quality education worldwide through innovative AI-powered learning platforms." 
              priority={1} 
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {foundersData.map((founder) => (
            <Card key={founder.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
                    <AvatarImage 
                      src={founder.image} 
                      alt={founder.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold mb-2">
                    <OptimizedLocalizedText text={founder.name} priority={2} />
                  </h3>
                  
                  <p className="text-primary font-semibold mb-4">
                    <OptimizedLocalizedText text={founder.role} priority={2} />
                  </p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  <OptimizedLocalizedText text={founder.bio} priority={1} />
                </p>

                <div className="flex justify-center space-x-4">
                  <a 
                    href={founder.linkedin} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={`${founder.name} LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href={founder.twitter}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    aria-label={`${founder.name} Twitter profile`}
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            <OptimizedLocalizedText 
              text="Together, we're building the future of education - one learner at a time." 
              priority={1} 
            />
          </p>
        </div>
      </div>
    </section>
  );
};
