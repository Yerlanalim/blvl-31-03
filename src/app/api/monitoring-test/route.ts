import { NextRequest, NextResponse } from 'next/server';
import { withAPIMonitoring, createMonitoredResponse } from '@/lib/utils/api-monitoring';
import * as Sentry from '@sentry/nextjs';

/**
 * Sample API route for testing monitoring capabilities
 * This function simulates various scenarios for testing monitoring:
 * - GET /api/monitoring-test - returns a success response with timing
 * - GET /api/monitoring-test?error=true - simulates an error for testing error tracking
 * - GET /api/monitoring-test?slow=true - simulates a slow response for performance tracking
 */
async function monitoringTestHandler(
  req: NextRequest
): Promise<NextResponse> {
  // Start timing for monitored response
  const startTime = performance.now();
  
  // Get URL parameters
  const url = new URL(req.url);
  const shouldError = url.searchParams.get('error') === 'true';
  const shouldBeSlow = url.searchParams.get('slow') === 'true';
  
  // Add a breadcrumb for demonstration
  Sentry.addBreadcrumb({
    category: 'monitoring-test',
    message: 'Monitoring test API called',
    data: {
      params: Object.fromEntries(url.searchParams),
    },
    level: 'info',
  });
  
  // Simulate an error if requested
  if (shouldError) {
    throw new Error('This is a test error for monitoring');
  }
  
  // Simulate a slow response if requested
  if (shouldBeSlow) {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Return a successful response with monitoring
  return createMonitoredResponse(
    { 
      success: true, 
      message: 'Monitoring test successful',
      params: Object.fromEntries(url.searchParams),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      apiName: 'monitoring-test',
      requestStartTime: startTime,
    }
  );
}

// Export the handler with monitoring wrapper
export const GET = withAPIMonitoring(monitoringTestHandler, {
  name: 'monitoring-test',
  shouldTrackPerformance: true,
  shouldTrackErrors: true,
}); 