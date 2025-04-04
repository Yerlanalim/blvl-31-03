'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture error details for debugging
    this.setState({ errorInfo });
    
    // Send the error to Sentry
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-background border border-border rounded-lg shadow-sm my-4">
          <div className="flex items-center text-destructive mb-4">
            <AlertCircle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-center">
            An error occurred while rendering this component. The issue has been reported to our team.
          </p>
          <Button onClick={this.handleReset} variant="default">
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-4 bg-muted rounded-lg w-full overflow-auto max-h-40">
              <p className="font-mono text-sm text-muted-foreground">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="font-mono text-xs text-muted-foreground mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export { ErrorBoundary }; 