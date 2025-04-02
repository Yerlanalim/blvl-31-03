'use client';

import { useContext } from 'react';
import { ErrorContext } from '@/context/ErrorContext';

type ErrorSeverity = 'info' | 'warning' | 'error' | 'success';

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorProvider");
  }
  
  return {
    /**
     * Handles an error by displaying a toast and logging it
     * @param error - The error object or message
     * @param customMessage - Optional custom message to display
     * @param severity - Severity level (info, warning, error, success)
     * @returns The ID of the error for reference
     */
    handleError: context.handleError,
    
    /**
     * Clears all errors from the error state
     */
    clearErrors: context.clearErrors,
    
    /**
     * List of all errors currently in the error state
     */
    errors: context.errors,
    
    /**
     * Utility method to wrap async functions with error handling
     * @param fn - The async function to wrap
     * @param customMessage - Optional custom error message
     * @param severity - Optional severity level
     */
    withErrorHandling: <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      customMessage?: string,
      severity?: ErrorSeverity
    ) => async (...args: T): Promise<R | undefined> => {
      try {
        return await fn(...args);
      } catch (error) {
        context.handleError(error, customMessage, severity);
        return undefined;
      }
    }
  };
}; 