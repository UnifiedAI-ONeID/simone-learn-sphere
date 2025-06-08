
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Keyboard, HelpCircle } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const KeyboardHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      key: '/',
      description: 'Open search',
      action: () => {}
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setIsOpen(true)
    },
    {
      key: 'Escape',
      description: 'Close dialogs and dropdowns',
      action: () => {}
    },
    {
      key: 'Tab',
      description: 'Navigate to next element',
      action: () => {}
    },
    {
      key: 'Tab',
      shiftKey: true,
      description: 'Navigate to previous element',
      action: () => {}
    },
    {
      key: 'Enter',
      description: 'Activate buttons and links',
      action: () => {}
    },
    {
      key: 'Space',
      description: 'Activate buttons and checkboxes',
      action: () => {}
    }
  ];

  useKeyboardShortcuts([
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setIsOpen(true)
    }
  ]);

  const formatShortcut = (shortcut: any) => {
    const keys = [];
    
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.shiftKey) keys.push('Shift');
    if (shortcut.altKey) keys.push('Alt');
    keys.push(shortcut.key === ' ' ? 'Space' : shortcut.key);
    
    return keys.join(' + ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
          aria-label="Keyboard shortcuts help"
        >
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate the application more efficiently.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Navigation Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">
                    {shortcut.description}
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {formatShortcut(shortcut)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Accessibility Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p>• All interactive elements are keyboard accessible</p>
                <p>• Screen reader compatible with proper ARIA labels</p>
                <p>• High contrast mode available in accessibility settings</p>
                <p>• Font size controls for better readability</p>
                <p>• Reduced motion options for users with vestibular disorders</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <HelpCircle className="h-4 w-4" />
            Press ? anywhere to open this help dialog
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
