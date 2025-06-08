
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug, Wifi } from 'lucide-react';
import { logError } from '@/utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, this.props.context, {
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });
    
    this.setState({
      error,
      errorInfo
    });
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

  private isNetworkError = () => {
    return this.state.error?.message?.toLowerCase().includes('network') ||
           this.state.error?.message?.toLowerCase().includes('fetch') ||
           !navigator.onLine;
  };

  private getErrorMessage = () => {
    if (this.isNetworkError()) {
      return 'Network connection issue. Please check your internet connection.';
    }
    
    if (this.props.context === 'translation') {
      return 'Translation service is temporarily unavailable.';
    }
    
    if (this.props.context === 'dashboard') {
      return 'Unable to load dashboard data.';
    }
    
    return 'An unexpected error occurred.';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.isNetworkError();

      return (
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {isNetworkError ? (
                  <Wifi className="h-12 w-12 text-destructive" />
                ) : (
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                )}
              </div>
              <CardTitle className="text-destructive">
                {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {this.getErrorMessage()}
                </p>
                
                {this.props.showDetails && process.env.NODE_ENV === 'development' && (
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
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={this.handleGoHome} variant="default" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                <Button 
                  onClick={() => {
                    const errorReport = {
                      message: this.state.error?.message,
                      stack: this.state.error?.stack,
                      componentStack: this.state.errorInfo?.componentStack,
                      context: this.props.context,
                      retryCount: this.state.retryCount,
                      userAgent: navigator.userAgent,
                      url: window.location.href,
                      timestamp: new Date().toISOString()
                    };
                    
                    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
                    alert('Error details copied to clipboard.');
                  }}
                  variant="ghost" 
                  size="sm"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Retry attempts: {this.state.retryCount}
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
