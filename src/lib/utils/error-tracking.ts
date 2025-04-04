import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Wraps an async function with error tracking capabilities
 * 
 * @param fn The async function to wrap
 * @param options Configuration options
 * @returns A wrapped function that automatically tracks errors
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    name?: string;
    context?: Record<string, any>;
    fingerprint?: string[];
  } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  // Extract function name for better tracking
  const fnName = options.name || fn.name || 'anonymous';
  
  return async function trackedFunction(...args: Parameters<T>): Promise<ReturnType<T>> {
    try {
      // Set transaction name and basic context
      Sentry.configureScope((scope) => {
        scope.setTransactionName(`function:${fnName}`);
        
        // Add custom context if provided
        if (options.context) {
          scope.setContext('function.context', options.context);
        }
        
        // Add function arguments as context (avoid sensitive data)
        if (process.env.NODE_ENV === 'development') {
          // Only add args in development to avoid capturing sensitive data
          scope.setContext('function.args', { 
            args: args.map(arg => typeof arg === 'object' ? 'Object' : arg).slice(0, 3)
          });
        }
        
        // Set custom fingerprint if provided
        if (options.fingerprint) {
          scope.setFingerprint(options.fingerprint);
        }
      });
      
      // Execute the original function
      return await fn(...args);
    } catch (error) {
      // Track the error with Sentry
      Sentry.captureException(error, {
        tags: {
          function: fnName,
        },
        // Include context data
        extra: {
          ...(options.context || {}),
        },
      });
      
      // Re-throw the error to allow the caller to handle it
      throw error;
    }
  };
}

/**
 * HOF (Higher Order Function) for API route handlers with built-in error tracking
 * 
 * @param handler The API route handler to wrap
 * @param options Configuration options
 * @returns A wrapped API handler with error tracking
 */
export function withAPIErrorTracking(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: {
    name?: string;
    context?: Record<string, any>;
  } = {}
) {
  // Extract handler name for better tracking
  const handlerName = options.name || handler.name || 'api-handler';
  
  return async function trackedAPIHandler(req: NextRequest, ...args: any[]): Promise<NextResponse> {
    try {
      // Set transaction name and basic context for the API call
      Sentry.configureScope((scope) => {
        scope.setTransactionName(`api:${handlerName}`);
        
        // Add request details as context
        scope.setContext('request', {
          url: req.url,
          method: req.method,
          headers: Object.fromEntries(req.headers),
        });
        
        // Add custom context if provided
        if (options.context) {
          scope.setContext('api.context', options.context);
        }
      });
      
      // Execute the original handler
      return await handler(req, ...args);
    } catch (error) {
      // Track the error with Sentry
      Sentry.captureException(error, {
        tags: {
          api: handlerName,
          method: req.method,
          url: req.url,
        },
      });
      
      // Return an appropriate error response
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred';
        
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  };
}

/**
 * Track a specific error to Sentry with additional context
 * 
 * @param error The error to track
 * @param options Additional tracking options
 */
export function trackError(
  error: unknown,
  options: {
    context?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
    fingerprint?: string[];
  } = {}
) {
  try {
    // Configure scope with the provided options
    Sentry.withScope((scope) => {
      // Set error level
      if (options.level) {
        scope.setLevel(options.level);
      }
      
      // Set tags
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      
      // Set context
      if (options.context) {
        scope.setContext('error.context', options.context);
      }
      
      // Set fingerprint if provided
      if (options.fingerprint) {
        scope.setFingerprint(options.fingerprint);
      }
      
      // Capture the exception
      Sentry.captureException(error);
    });
  } catch (e) {
    // Fallback if Sentry tracking fails
    console.error('Failed to track error with Sentry:', e);
    console.error('Original error:', error);
  }
} 