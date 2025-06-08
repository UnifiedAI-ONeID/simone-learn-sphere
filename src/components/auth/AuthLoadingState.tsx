
import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AuthLoadingStateProps {
  message?: string;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <LoadingSpinner 
        size="lg" 
        icon="brain" 
        text={message}
        fullScreen={false}
      />
    </div>
  );
};
