'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';
import { reportWebVitals } from '@/lib/utils/analytics';

interface WebVitalsProps {
  /**
   * The route or page path for more granular tracking
   */
  path?: string;
}

/**
 * A component that tracks Core Web Vitals on mount.
 * Include this in your app layout for comprehensive performance tracking.
 */
export function WebVitals({ path }: WebVitalsProps) {
  useEffect(() => {
    // Define a reporting function with path context
    const reportWithContext = (metric: any) => {
      // Add page context to the metric
      if (path) {
        metric.path = path;
      }
      
      // Report the metric with our utility
      reportWebVitals(metric);
    };

    // Register metrics reporting
    onCLS(reportWithContext);
    onFID(reportWithContext);
    onLCP(reportWithContext);
    onFCP(reportWithContext);
    onTTFB(reportWithContext);

    // Log initialization
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals tracking initialized', { path });
    }
  }, [path]);

  // This component doesn't render anything
  return null;
}

export default WebVitals; 