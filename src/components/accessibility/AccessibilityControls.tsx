import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accessibility,
  Type,
  Contrast,
  Volume2,
  Mouse,
  Eye,
  Keyboard,
  Monitor,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';
import { useToast } from '@/hooks/use-toast';

interface AccessibilityControlsProps {
  onSettingsChange: (settings: any) => void;
  initialSettings: any;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ onSettingsChange, initialSettings }) => {
  const [fontSize, setFontSize] = useState(initialSettings?.fontSize || 16);
  const [highContrast, setHighContrast] = useState(initialSettings?.highContrast || false);
  const [darkMode, setDarkMode] = useState(initialSettings?.darkMode || false);
  const [cursorSize, setCursorSize] = useState(initialSettings?.cursorSize || 1);
  const [keyboardNavigation, setKeyboardNavigation] = useState(initialSettings?.keyboardNavigation || false);
  const [textToSpeech, setTextToSpeech] = useState(initialSettings?.textToSpeech || false);
  const [language, setLanguage] = useState(initialSettings?.language || 'en');
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFontSize(initialSettings?.fontSize || 16);
    setHighContrast(initialSettings?.highContrast || false);
    setDarkMode(initialSettings?.darkMode || false);
    setCursorSize(initialSettings?.cursorSize || 1);
    setKeyboardNavigation(initialSettings?.keyboardNavigation || false);
    setTextToSpeech(initialSettings?.textToSpeech || false);
    setLanguage(initialSettings?.language || 'en');
  }, [initialSettings]);

  useEffect(() => {
    const settings = {
      fontSize,
      highContrast,
      darkMode,
      cursorSize,
      keyboardNavigation,
      textToSpeech,
      language
    };
    onSettingsChange(settings);
  }, [fontSize, highContrast, darkMode, cursorSize, keyboardNavigation, textToSpeech, language, onSettingsChange]);

  const handleResetSettings = () => {
    setIsResetting(true);
    setFontSize(16);
    setHighContrast(false);
    setDarkMode(false);
    setCursorSize(1);
    setKeyboardNavigation(false);
    setTextToSpeech(false);
    setLanguage('en');
    setIsResetting(false);

    toast({
      title: "Accessibility settings reset",
      description: "All accessibility settings have been reset to their defaults.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          <UnifiedLocalizedText text="Accessibility Settings" />
        </CardTitle>
        <CardDescription>
          <UnifiedLocalizedText text="Customize your experience" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <UnifiedLocalizedText text="Font Size" />
            </Label>
            <Badge variant="secondary">{fontSize}px</Badge>
          </div>
          <Slider
            id="font-size"
            defaultValue={[fontSize]}
            max={30}
            min={12}
            step={1}
            onValueChange={(value) => setFontSize(value[0])}
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="flex items-center gap-2">
            <Contrast className="h-4 w-4" />
            <UnifiedLocalizedText text="High Contrast" />
          </Label>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <UnifiedLocalizedText text="Dark Mode" />
          </Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>

        {/* Cursor Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cursor-size" className="flex items-center gap-2">
              <Mouse className="h-4 w-4" />
              <UnifiedLocalizedText text="Cursor Size" />
            </Label>
            <Badge variant="secondary">{cursorSize}x</Badge>
          </div>
          <Slider
            id="cursor-size"
            defaultValue={[cursorSize]}
            max={3}
            min={1}
            step={0.1}
            onValueChange={(value) => setCursorSize(value[0])}
          />
        </div>

        {/* Keyboard Navigation */}
        <div className="flex items-center justify-between">
          <Label htmlFor="keyboard-navigation" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <UnifiedLocalizedText text="Keyboard Navigation" />
          </Label>
          <Switch
            id="keyboard-navigation"
            checked={keyboardNavigation}
            onCheckedChange={setKeyboardNavigation}
          />
        </div>

        {/* Text-to-Speech */}
        <div className="flex items-center justify-between">
          <Label htmlFor="text-to-speech" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <UnifiedLocalizedText text="Text-to-Speech" />
          </Label>
          <Switch
            id="text-to-speech"
            checked={textToSpeech}
            onCheckedChange={setTextToSpeech}
          />
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <Label htmlFor="language" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <UnifiedLocalizedText text="Language" />
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Reset Settings */}
        <Button variant="outline" className="w-full" onClick={handleResetSettings} disabled={isResetting}>
          <RotateCcw className="h-4 w-4 mr-2" />
          <UnifiedLocalizedText text={isResetting ? "Resetting..." : "Reset to Defaults"} />
        </Button>
      </CardContent>
    </Card>
  );
};
