/**
 * Utility functions for standardizing component state management
 */
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}

/**
 * Standard loading state component
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ 
  children, 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {children}
    </div>
  );
};

interface ErrorStateProps {
  error: Error | string | null;
  onRetry?: () => void;
  className?: string;
}

/**
 * Standard error state component
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  className = '' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An error occurred';
  
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="pt-6 text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-medium">Error</h3>
        <p className="text-sm text-muted-foreground mt-2">{errorMessage}</p>
      </CardContent>
      {onRetry && (
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={onRetry} variant="outline" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Standard empty state component
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'No data found', 
  message = 'There are no items to display at this time.', 
  actionText, 
  onAction, 
  icon,
  className = '' 
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="pt-6 text-center">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      </CardContent>
      {actionText && onAction && (
        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button onClick={onAction} variant="outline">
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

/**
 * Renders content based on loading, error, and empty states
 */
export function withStateHandling<T>({
  data,
  isLoading,
  error,
  onRetry,
  emptyStateProps,
  loadingStateProps = {},
  renderData
}: {
  data: T | null | undefined;
  isLoading: boolean;
  error: Error | string | null | unknown;
  onRetry?: () => void;
  emptyStateProps?: Omit<EmptyStateProps, 'className'>;
  loadingStateProps?: Omit<LoadingStateProps, 'className'>;
  renderData: (data: T) => React.ReactNode;
}) {
  // Handle loading state
  if (isLoading) {
    return <LoadingState {...loadingStateProps} />;
  }

  // Handle error state
  if (error) {
    return (
      <ErrorState 
        error={error instanceof Error ? error : String(error)} 
        onRetry={onRetry} 
      />
    );
  }

  // Handle empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <EmptyState {...emptyStateProps} />;
  }

  // Render data
  return renderData(data);
}

/**
 * Collection of skeleton components for common UI patterns
 */
export const Skeletons = {
  // Card skeleton with customizable number of lines
  Card: ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
    <div className={`space-y-3 ${className}`}>
      <Skeleton className="h-[125px] w-full rounded-xl" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  ),
  
  // List item skeleton with customizable height
  ListItem: ({ height = 'h-16', className = '' }: { height?: string; className?: string }) => (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
  
  // Text skeleton with customizable width
  Text: ({ width = 'w-full', className = '' }: { width?: string; className?: string }) => (
    <Skeleton className={`h-4 ${width} ${className}`} />
  ),
  
  // Button skeleton with customizable width
  Button: ({ width = 'w-[100px]', className = '' }: { width?: string; className?: string }) => (
    <Skeleton className={`h-10 ${width} rounded-md ${className}`} />
  )
}; 