'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, trackUserMetric } from '@/lib/utils/analytics';
import * as Sentry from '@sentry/nextjs';

/**
 * Component that tracks user navigation between pages.
 * It should be included in the root layout to track all navigations.
 */
export function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const [navigationStart, setNavigationStart] = useState<number>(Date.now());

  useEffect(() => {
    // Skip the initial render
    if (lastPathname === null) {
      setLastPathname(pathname);
      return;
    }

    // Calculate the time spent on the previous page
    const timeOnPage = Date.now() - navigationStart;
    
    // Track the navigation event
    trackEvent('navigation', {
      from_path: lastPathname,
      to_path: pathname,
      search_params: searchParams?.toString() || '',
      time_on_previous_page_ms: timeOnPage,
    });
    
    // Track how long the user spent on the page
    trackUserMetric('time_on_page', timeOnPage, {
      path: lastPathname,
    });
    
    // Set a Sentry breadcrumb for this navigation
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated from ${lastPathname} to ${pathname}`,
      data: {
        from: lastPathname,
        to: pathname,
        params: searchParams?.toString() || '',
        timeOnPage: timeOnPage,
      },
      level: 'info',
    });
    
    // Reset for the next page
    setLastPathname(pathname);
    setNavigationStart(Date.now());
    
    // Set Sentry context for better error tracking
    Sentry.setContext('navigation', {
      current_path: pathname,
      search_params: searchParams?.toString() || '',
      previous_path: lastPathname,
    });
    
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}

export default NavigationTracker; 