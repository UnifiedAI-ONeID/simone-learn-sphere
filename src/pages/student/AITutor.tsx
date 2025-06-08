import React from 'react';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, BookOpen, Lightbulb } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const AITutor = () => {
  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <h1>
          <UnifiedLocalizedText text="AI Tutor" />
        </h1>
      </div>
    </PlatformLayout>
  );
};

