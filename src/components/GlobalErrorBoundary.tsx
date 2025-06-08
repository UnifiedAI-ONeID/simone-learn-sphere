import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error tracking service
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorReport = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // Copy to clipboard for user to send
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    alert('Error details copied to clipboard. Please send this to support.');
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAuthError = this.state.error?.message?.toLowerCase().includes('auth');
      const isNetworkError = this.state.error?.message?.toLowerCase().includes('network');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-destructive">
                <UnifiedLocalizedText text="Something went wrong" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isAuthError && (
                    <UnifiedLocalizedText text="There was an authentication error. Please try signing in again." />
                  )}
                  {isNetworkError && (
                    <UnifiedLocalizedText text="Network connection issue. Please check your internet connection." />
                  )}
                  {!isAuthError && !isNetworkError && (
                    <UnifiedLocalizedText text="An unexpected error occurred. Please try again." />
                  )}
                </p>
                
                {process.env.NODE_ENV === 'development' && (
                  <details className="text-left text-xs bg-muted p-2 rounded">
                    <summary className="cursor-pointer font-medium">Error Details</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.error?.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={this.handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Try Again" />
                </Button>
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Reload Page" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={this.handleGoHome} variant="default" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Go Home" />
                </Button>
                <Button onClick={this.handleReportError} variant="ghost" size="sm">
                  <Bug className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Report" />
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  <UnifiedLocalizedText text={`Retry attempts: ${this.state.retryCount}`} />
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
