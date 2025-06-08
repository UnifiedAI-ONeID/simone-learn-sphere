
import React from 'react';
import { Loader2, Brain, AlertTriangle, Wifi } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  icon?: 'default' | 'brain';
  className?: string;
  fullScreen?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  icon = 'default',
  className,
  fullScreen = false,
  error,
  onRetry
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (error) {
    const isNetworkError = error.toLowerCase().includes('network') || !navigator.onLine;
    const ErrorIcon = isNetworkError ? Wifi : AlertTriangle;
    
    const content = (
      <div className={cn("flex flex-col items-center justify-center gap-3 text-center", className)}>
        <ErrorIcon className={cn(sizeClasses[size], "text-destructive")} />
        <div className="space-y-2">
          <p className="text-sm text-destructive">
            <LocalizedText text={error} />
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              <LocalizedText text="Try Again" />
            </Button>
          )}
        </div>
      </div>
    );

    if (fullScreen) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          {content}
        </div>
      );
    }

    return content;
  }

  const IconComponent = icon === 'brain' ? Brain : Loader2;
  const iconClass = icon === 'brain' ? 'animate-pulse' : 'animate-spin';

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <IconComponent className={cn(sizeClasses[size], iconClass, "text-primary")} />
      {text && (
        <p className="text-sm text-muted-foreground text-center">
          <LocalizedText text={text} />
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }

  return content;
};
