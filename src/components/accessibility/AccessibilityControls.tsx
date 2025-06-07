import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Accessibility, 
  Type, 
  Contrast, 
  Volume, 
  Eye,
  Minus,
  Plus,
  Settings
} from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { useToast } from '@/hooks/use-toast';

export const AccessibilityControls: React.FC = () => {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcements, setAnnouncements] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion') === 'true';
    const savedAnnouncements = localStorage.getItem('accessibility-announcements') !== 'false';

    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setAnnouncements(savedAnnouncements);

    // Apply settings
    applyFontSize(savedFontSize || 'medium');
    applyHighContrast(savedHighContrast);
    applyReducedMotion(savedReducedMotion);
  }, []);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (size) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
  };

  const applyHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const applyReducedMotion = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('accessibility-font-size', size);
    applyFontSize(size);
    
    toast({
      title: "Font size updated",
      description: `Text size changed to ${size}`,
    });

    // Announce to screen readers
    if (announcements) {
      announceToScreenReader(`Font size changed to ${size}`);
    }
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('accessibility-high-contrast', newValue.toString());
    applyHighContrast(newValue);
    
    toast({
      title: newValue ? "High contrast enabled" : "High contrast disabled",
      description: newValue ? "Improved visibility activated" : "Normal contrast restored",
    });

    if (announcements) {
      announceToScreenReader(newValue ? "High contrast mode enabled" : "High contrast mode disabled");
    }
  };

  const handleReducedMotionToggle = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reduced-motion', newValue.toString());
    applyReducedMotion(newValue);
    
    toast({
      title: newValue ? "Reduced motion enabled" : "Reduced motion disabled",
      description: newValue ? "Animations minimized" : "Full animations restored",
    });

    if (announcements) {
      announceToScreenReader(newValue ? "Reduced motion enabled" : "Reduced motion disabled");
    }
  };

  const handleAnnouncementsToggle = () => {
    const newValue = !announcements;
    setAnnouncements(newValue);
    localStorage.setItem('accessibility-announcements', newValue.toString());
    
    toast({
      title: newValue ? "Screen reader announcements enabled" : "Screen reader announcements disabled",
      description: newValue ? "You will hear updates" : "Updates will be silent",
    });
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="flex items-center space-x-2 mb-4">
            <Accessibility className="h-4 w-4" />
            <span className="font-semibold">
              <LocalizedText text="Accessibility Settings" />
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Font Size Controls */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Type className="h-4 w-4" />
                <span className="text-sm font-medium">
                  <LocalizedText text="Text Size" />
                </span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant={fontSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('small')}
                  className="flex-1"
                >
                  <Minus className="h-3 w-3 mr-1" />
                  <LocalizedText text="Small" />
                </Button>
                <Button
                  variant={fontSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('medium')}
                  className="flex-1"
                >
                  <LocalizedText text="Medium" />
                </Button>
                <Button
                  variant={fontSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFontSizeChange('large')}
                  className="flex-1"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <LocalizedText text="Large" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4" />
                <span className="text-sm font-medium">
                  <LocalizedText text="High Contrast" />
                </span>
              </div>
              <Button
                variant={highContrast ? 'default' : 'outline'}
                size="sm"
                onClick={handleHighContrastToggle}
              >
                {highContrast ? (
                  <LocalizedText text="Enabled" />
                ) : (
                  <LocalizedText text="Disabled" />
                )}
              </Button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  <LocalizedText text="Reduce Motion" />
                </span>
              </div>
              <Button
                variant={reducedMotion ? 'default' : 'outline'}
                size="sm"
                onClick={handleReducedMotionToggle}
              >
                {reducedMotion ? (
                  <LocalizedText text="Enabled" />
                ) : (
                  <LocalizedText text="Disabled" />
                )}
              </Button>
            </div>

            {/* Screen Reader Announcements */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume className="h-4 w-4" />
                <span className="text-sm font-medium">
                  <LocalizedText text="Announcements" />
                </span>
              </div>
              <Button
                variant={announcements ? 'default' : 'outline'}
                size="sm"
                onClick={handleAnnouncementsToggle}
              >
                {announcements ? (
                  <LocalizedText text="On" />
                ) : (
                  <LocalizedText text="Off" />
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-xs text-gray-500">
            <LocalizedText text="Settings are saved automatically and persist between sessions." />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
