
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Accessibility, 
  Eye, 
  Volume2, 
  Type, 
  Contrast, 
  MousePointer, 
  Keyboard,
  Monitor,
  Sun,
  Moon,
  Settings,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: number;
  colorScheme: 'light' | 'dark' | 'auto';
  focusVisible: boolean;
  audioDescriptions: boolean;
}

export const AccessibilityControls: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    fontSize: 16,
    colorScheme: 'auto',
    focusVisible: true,
    audioDescriptions: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`;

    // Focus visible
    if (newSettings.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Color scheme
    if (newSettings.colorScheme === 'dark') {
      root.classList.add('dark');
    } else if (newSettings.colorScheme === 'light') {
      root.classList.remove('dark');
    }
    // 'auto' is handled by system preference
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      fontSize: 16,
      colorScheme: 'auto',
      focusVisible: true,
      audioDescriptions: false
    };
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to defaults.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Accessibility className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Accessibility Controls</CardTitle>
              <CardDescription>
                Customize your experience with accessibility features
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Settings className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Accessibility */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-4 w-4" />
            <h3 className="font-semibold">Visual</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="highContrast">High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="highContrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSetting('highContrast', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="largeText">Large Text</Label>
              <p className="text-sm text-muted-foreground">
                Increase default text size
              </p>
            </div>
            <Switch
              id="largeText"
              checked={settings.largeText}
              onCheckedChange={(checked) => updateSetting('largeText', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={(value) => updateSetting('fontSize', value[0])}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select
              value={settings.colorScheme}
              onValueChange={(value: 'light' | 'dark' | 'auto') => 
                updateSetting('colorScheme', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Auto (System)
                  </div>
                </SelectItem>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Motion & Navigation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MousePointer className="h-4 w-4" />
            <h3 className="font-semibold">Motion & Navigation</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reducedMotion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="keyboardNavigation">Enhanced Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">
                Improve keyboard navigation experience
              </p>
            </div>
            <Switch
              id="keyboardNavigation"
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="focusVisible">Visible Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">
                Show clear focus outlines on interactive elements
              </p>
            </div>
            <Switch
              id="focusVisible"
              checked={settings.focusVisible}
              onCheckedChange={(checked) => updateSetting('focusVisible', checked)}
            />
          </div>
        </div>

        {/* Screen Reader & Audio */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="h-4 w-4" />
            <h3 className="font-semibold">Screen Reader & Audio</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="screenReader">Screen Reader Optimization</Label>
              <p className="text-sm text-muted-foreground">
                Optimize content for screen readers
              </p>
            </div>
            <Switch
              id="screenReader"
              checked={settings.screenReader}
              onCheckedChange={(checked) => updateSetting('screenReader', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="audioDescriptions">Audio Descriptions</Label>
              <p className="text-sm text-muted-foreground">
                Enable audio descriptions for media content
              </p>
            </div>
            <Switch
              id="audioDescriptions"
              checked={settings.audioDescriptions}
              onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
            />
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t">
          <Button variant="outline" onClick={resetSettings} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
