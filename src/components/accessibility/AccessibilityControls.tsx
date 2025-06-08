
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
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
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
      description: "Accessibility settings have been reset to defaults.",
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          <UnifiedLocalizedText text="Accessibility Controls" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Customize your experience for better accessibility" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <UnifiedLocalizedText text="Visual Settings" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Contrast className="h-4 w-4" />
                <UnifiedLocalizedText text="High Contrast" />
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <UnifiedLocalizedText text="Large Text" />
              </Label>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(checked) => updateSetting('largeText', checked)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <UnifiedLocalizedText text="Font Size" />
            </Label>
            <div className="flex items-center gap-4">
              <span className="text-sm">12px</span>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting('fontSize', value)}
                min={12}
                max={24}
                step={1}
                className="flex-1"
              />
              <span className="text-sm">24px</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <UnifiedLocalizedText text="Current size" />: {settings.fontSize}px
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <UnifiedLocalizedText text="Color Scheme" />
            </Label>
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
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <UnifiedLocalizedText text="Light" />
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <UnifiedLocalizedText text="Dark" />
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <UnifiedLocalizedText text="System" />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Motion Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            <UnifiedLocalizedText text="Motion & Interaction" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2">
                <UnifiedLocalizedText text="Reduced Motion" />
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="focus-visible" className="flex items-center gap-2">
                <UnifiedLocalizedText text="Focus Indicators" />
              </Label>
              <Switch
                id="focus-visible"
                checked={settings.focusVisible}
                onCheckedChange={(checked) => updateSetting('focusVisible', checked)}
              />
            </div>
          </div>
        </div>

        {/* Navigation Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <UnifiedLocalizedText text="Navigation" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-navigation" className="flex items-center gap-2">
                <UnifiedLocalizedText text="Keyboard Navigation" />
              </Label>
              <Switch
                id="keyboard-navigation"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="flex items-center gap-2">
                <UnifiedLocalizedText text="Screen Reader Support" />
              </Label>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => updateSetting('screenReader', checked)}
              />
            </div>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <UnifiedLocalizedText text="Audio" />
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="audio-descriptions" className="flex items-center gap-2">
              <UnifiedLocalizedText text="Audio Descriptions" />
            </Label>
            <Switch
              id="audio-descriptions"
              checked={settings.audioDescriptions}
              onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
            />
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="outline" className="flex items-center gap-1">
            <Accessibility className="h-3 w-3" />
            <UnifiedLocalizedText text="Accessibility Enabled" />
          </Badge>
          
          <Button onClick={resetSettings} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            <UnifiedLocalizedText text="Reset" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
