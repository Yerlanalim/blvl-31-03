'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';

type ErrorSeverity = 'info' | 'warning' | 'error' | 'success';

interface ErrorContextType {
  handleError: (error: Error | unknown, customMessage?: string, severity?: ErrorSeverity) => void;
  clearErrors: () => void;
  errors: Array<{ id: string; message: string; severity: ErrorSeverity }>;
}

export const ErrorContext = createContext<ErrorContextType | null>(null);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [errors, setErrors] = useState<Array<{ id: string; message: string; severity: ErrorSeverity }>>([]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleError = useCallback((error: Error | unknown, customMessage?: string, severity: ErrorSeverity = 'error') => {
    const errorMessage = customMessage || 
      (error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    
    // Generate a unique ID for the error
    const errorId = Date.now().toString();
    
    // Add error to state
    setErrors(prev => [...prev, { id: errorId, message: errorMessage, severity }]);
    
    // Show toast notification based on severity
    switch (severity) {
      case 'info':
        toast.info(errorMessage);
        break;
      case 'warning':
        toast.warning(errorMessage);
        break;
      case 'success':
        toast.success(errorMessage);
        break;
      case 'error':
      default:
        toast.error(errorMessage);
        break;
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled by ErrorContext:', error);
    }

    return errorId;
  }, []);

  return (
    <ErrorContext.Provider value={{ handleError, clearErrors, errors }}>
      {children}
    </ErrorContext.Provider>
  );
}; 