'use client';

import React, { ComponentType, useState } from 'react';
import ErrorFallback from '@/components/ui/ErrorFallback';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface WithErrorHandlingProps {
  [key: string]: any;
}

/**
 * Higher Order Component that adds error handling to any component
 * @param WrappedComponent - The component to wrap with error handling
 * @param fallbackProps - Optional props to customize the error fallback
 */
export function withErrorHandling<P extends WithErrorHandlingProps>(
  WrappedComponent: ComponentType<P>,
  fallbackProps?: {
    title?: string;
    message?: string;
    severity?: 'error' | 'warning' | 'info';
  }
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorHandling = (props: P) => {
    const [error, setError] = useState<Error | null>(null);
    const { handleError } = useErrorHandler();

    const handleRetry = () => {
      setError(null);
    };

    if (error) {
      return (
        <ErrorFallback
          error={error}
          retry={handleRetry}
          title={fallbackProps?.title}
          message={fallbackProps?.message}
          severity={fallbackProps?.severity || 'error'}
        />
      );
    }

    try {
      return (
        <WrappedComponent
          {...props}
          onError={(e: Error) => {
            setError(e);
            handleError(e);
          }}
        />
      );
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Неизвестная ошибка');
      setError(error);
      handleError(error);
      return (
        <ErrorFallback
          error={error}
          retry={handleRetry}
          title={fallbackProps?.title}
          message={fallbackProps?.message}
          severity={fallbackProps?.severity || 'error'}
        />
      );
    }
  };

  ComponentWithErrorHandling.displayName = `withErrorHandling(${displayName})`;
  return ComponentWithErrorHandling;
}

export default withErrorHandling; 