'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/utils/analytics';
import * as Sentry from '@sentry/nextjs';
import { useAuth } from '@/hooks/useAuth';

/**
 * Higher-order component that wraps a component with analytics tracking.
 * 
 * @param Component The component to wrap
 * @param options Configuration options
 * @returns A wrapped component with analytics tracking
 */
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    pageName: string;
    trackPageView?: boolean;
    trackUserContext?: boolean;
  } = { pageName: 'unknown', trackPageView: true, trackUserContext: true }
) {
  // Return a new component with analytics capabilities
  const WithAnalytics = (props: P) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    useEffect(() => {
      try {
        // Track page view when the component mounts or route changes
        if (options.trackPageView) {
          trackEvent('page_view', {
            page_path: pathname,
            page_name: options.pageName,
            search_params: searchParams?.toString() || '',
          });
        }
        
        // Set Sentry user context if configured
        if (options.trackUserContext && user) {
          const userContext = {
            id: user.uid,
            username: user.displayName || user.email || 'unknown',
            // Avoid sending sensitive data like email
          };
          
          Sentry.setUser(userContext);
        }
        
        // Set Sentry context for better error tracking
        Sentry.setContext('page', {
          pageName: options.pageName,
          path: pathname,
          searchParams: searchParams?.toString() || '',
        });
        
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
      
      // Cleanup function to reset Sentry user context when component unmounts
      return () => {
        if (options.trackUserContext) {
          Sentry.setUser(null);
        }
      };
    }, [pathname, searchParams?.toString(), user?.uid]);
    
    // Render the wrapped component with its original props
    return <Component {...props} />;
  };
  
  // Update the display name for easier debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithAnalytics.displayName = `WithAnalytics(${displayName})`;
  
  return WithAnalytics;
}

export default withAnalytics; 