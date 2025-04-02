'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { reportWebVitals } from '@/lib/services/analytics-service';

/**
 * Component that initializes web vitals tracking
 * Add this component to your layout to track performance metrics
 */
export function WebVitals() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Report web vitals when component mounts
    reportWebVitals();
  }, []);

  // Track page views and re-report metrics when route changes
  useEffect(() => {
    // The pathname has changed, track a page view
    if (process.env.NODE_ENV === 'production') {
      // In production, you would typically log this to your analytics
      // This is a placeholder for your analytics implementation
    } else {
      console.log(`Page view: ${pathname}${searchParams ? `?${searchParams}` : ''}`);
    }

    // Re-report web vitals on route change
    reportWebVitals();
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

export default WebVitals; 