'use client';

import { useCallback, useEffect, useRef } from 'react';
import { trackEvent, trackUserMetric } from '@/lib/utils/analytics';
import { usePathname } from 'next/navigation';

/**
 * Custom hook to track user interactions with components
 * @param componentName Name of the component being tracked
 * @param options Additional tracking options
 * @returns Methods for tracking interactions
 */
export function useAnalyticsTracker(
  componentName: string,
  options: {
    trackMounts?: boolean;
    trackInteractionTime?: boolean;
    category?: string;
  } = {}
) {
  const { 
    trackMounts = true,
    trackInteractionTime = true,
    category = 'component' 
  } = options;
  
  const pathname = usePathname();
  const mountTimeRef = useRef<number>(Date.now());
  const interactionStartTimeRef = useRef<number | null>(null);
  
  // Track initial mount
  useEffect(() => {
    if (trackMounts) {
      mountTimeRef.current = Date.now();
      trackEvent('component_mounted', {
        component_name: componentName,
        category,
        page_path: pathname,
      });
    }
    
    // Track unmount and possibly interaction time
    return () => {
      if (trackMounts) {
        const mountDuration = Date.now() - mountTimeRef.current;
        trackEvent('component_unmounted', {
          component_name: componentName,
          category,
          page_path: pathname,
          mount_duration_ms: mountDuration,
        });
        
        if (trackInteractionTime && interactionStartTimeRef.current) {
          const interactionTime = Date.now() - interactionStartTimeRef.current;
          trackUserMetric('component_interaction_time', interactionTime, {
            component_name: componentName,
            category,
            page_path: pathname,
          });
        }
      }
    };
  }, [componentName, category, pathname, trackMounts, trackInteractionTime]);
  
  // Track start of user interaction
  const trackInteractionStart = useCallback(() => {
    if (!interactionStartTimeRef.current) {
      interactionStartTimeRef.current = Date.now();
      trackEvent('interaction_started', {
        component_name: componentName,
        category,
        page_path: pathname,
      });
    }
  }, [componentName, category, pathname]);
  
  // Track end of user interaction
  const trackInteractionEnd = useCallback(() => {
    if (interactionStartTimeRef.current) {
      const interactionTime = Date.now() - interactionStartTimeRef.current;
      trackEvent('interaction_ended', {
        component_name: componentName,
        category,
        page_path: pathname,
        interaction_time_ms: interactionTime,
      });
      
      if (trackInteractionTime) {
        trackUserMetric('component_interaction_time', interactionTime, {
          component_name: componentName,
          category,
          page_path: pathname,
        });
      }
      
      interactionStartTimeRef.current = null;
    }
  }, [componentName, category, pathname, trackInteractionTime]);
  
  // Track a specific event with component context
  const trackComponentEvent = useCallback(
    (eventName: string, additionalParams: Record<string, any> = {}) => {
      trackEvent(eventName, {
        component_name: componentName,
        category,
        page_path: pathname,
        ...additionalParams,
      });
    },
    [componentName, category, pathname]
  );
  
  return {
    trackInteractionStart,
    trackInteractionEnd,
    trackComponentEvent,
  };
} 