import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { trackUserMetric } from './analytics';

/**
 * Wraps an API route handler with performance monitoring and error tracking
 * 
 * @param handler The API route handler function
 * @param options Configuration options
 * @returns A wrapped handler with monitoring capabilities
 */
export function withAPIMonitoring(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: {
    name?: string;
    shouldTrackPerformance?: boolean;
    shouldTrackErrors?: boolean;
  } = { shouldTrackPerformance: true, shouldTrackErrors: true }
) {
  // Extract handler name for better tracking
  const handlerName = options.name || handler.name || 'api-handler';
  const {
    shouldTrackPerformance = true,
    shouldTrackErrors = true,
  } = options;
  
  return async function monitoredAPIHandler(
    req: NextRequest,
    ...args: any[]
  ): Promise<NextResponse> {
    // Start timing the request
    const startTime = performance.now();
    
    // Create a transaction for this API call
    const transaction = shouldTrackPerformance 
      ? Sentry.startTransaction({
          name: `api:${handlerName}`,
          op: 'http.server',
          data: {
            url: req.url,
            method: req.method,
          },
        })
      : null;

    try {
      // Set the transaction as current if it exists
      if (transaction) {
        Sentry.configureScope((scope) => {
          scope.setSpan(transaction);
        });
      }
      
      // Add breadcrumb for this API call
      if (shouldTrackErrors) {
        Sentry.addBreadcrumb({
          category: 'api',
          message: `API call: ${req.method} ${new URL(req.url).pathname}`,
          level: 'info',
          data: {
            url: req.url,
            method: req.method,
            headers: Object.fromEntries(
              Array.from(req.headers.entries())
                .filter(([key]) => !['cookie', 'authorization'].includes(key.toLowerCase()))
            ),
          },
        });
      }
      
      // Execute the original handler
      const response = await handler(req, ...args);
      
      // Record API response timing if tracking performance
      if (shouldTrackPerformance) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Track performance metrics
        trackUserMetric('api_response_time', duration, {
          api: handlerName,
          path: new URL(req.url).pathname,
          method: req.method,
          status: response.status,
        });
        
        // Finish the transaction with status
        if (transaction) {
          transaction.setData('status', response.status);
          transaction.setData('duration_ms', duration);
          transaction.finish();
        }
      }
      
      return response;
    } catch (error) {
      // Track error if enabled
      if (shouldTrackErrors) {
        Sentry.captureException(error, {
          tags: {
            api: handlerName,
            method: req.method,
            path: new URL(req.url).pathname,
          },
        });
      }
      
      // Record API failure if tracking performance
      if (shouldTrackPerformance && transaction) {
        transaction.setStatus('internal_error');
        transaction.finish();
      }
      
      // Return a standardized error response
      console.error(`API Error in ${handlerName}:`, error);
      
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
 * Enhanced version of NextResponse with status tracking
 */
export function createMonitoredResponse<T>(
  data: T,
  options: {
    status?: number;
    headers?: HeadersInit;
    apiName?: string;
    requestStartTime?: number;
  } = {}
): NextResponse {
  const { status = 200, headers, apiName, requestStartTime } = options;
  
  // Create the response
  const response = NextResponse.json(data, { status, headers });
  
  // Track performance if we have timing data
  if (apiName && requestStartTime) {
    const duration = performance.now() - requestStartTime;
    
    // Track API response time
    trackUserMetric('api_response_time', duration, {
      api: apiName,
      status,
    });
    
    // Add breadcrumb for API response
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API response: ${apiName}`,
      level: 'info',
      data: {
        status,
        duration_ms: Math.round(duration),
      },
    });
  }
  
  return response;
} 