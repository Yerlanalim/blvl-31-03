import { 
  getCLS, 
  getFID, 
  getLCP, 
  getFCP, 
  getTTFB,
  type Metric 
} from 'web-vitals';

/**
 * Types of Web Vitals metrics
 */
export type WebVitalsMetric = 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB';

/**
 * Metric data with additional context
 */
interface EnhancedMetric extends Metric {
  path?: string;
  userId?: string;
  deviceType?: string;
}

/**
 * Handler type for web vitals reporting
 */
type WebVitalsReportHandler = (metric: EnhancedMetric) => void;

/**
 * Default handler for web vitals metrics - console logs in development, no-op in production
 */
const defaultHandler: WebVitalsReportHandler = (metric) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Web Vitals: ${metric.name} - ${metric.value}`);
  }
};

/**
 * Gets the current path for context
 */
const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.pathname + window.location.search;
};

/**
 * Gets the device type based on screen width
 */
const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Get the user ID from localStorage or session if available
 */
const getUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    // Try to find userId in localStorage (this is just an example, adapt to your auth system)
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.uid || undefined;
    }
    
    // Alternative: generate and store anonymous ID if needed
    return undefined;
  } catch (e) {
    return undefined;
  }
};

/**
 * Reports web vitals metrics with additional context
 * @param handler Optional custom handler function
 */
export const reportWebVitals = (handler: WebVitalsReportHandler = defaultHandler): void => {
  try {
    // Enhanced handler that adds context to metrics
    const enhancedHandler: (metric: Metric) => void = (metric) => {
      const enhancedMetric: EnhancedMetric = {
        ...metric,
        path: getCurrentPath(),
        deviceType: getDeviceType(),
        userId: getUserId(),
      };
      
      handler(enhancedMetric);
    };
    
    // Report all core web vitals
    getCLS(enhancedHandler);
    getFID(enhancedHandler);
    getLCP(enhancedHandler);
    getFCP(enhancedHandler);
    getTTFB(enhancedHandler);
  } catch (error) {
    console.error('Error reporting web vitals:', error);
  }
};

/**
 * Tracks a custom event with additional context
 * @param eventName Name of the event to track
 * @param properties Additional properties for the event
 */
export const trackEvent = (eventName: string, properties: Record<string, any> = {}): void => {
  try {
    // In development, just log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Event: ${eventName}`, properties);
      return;
    }
    
    // In production, you can integrate with your analytics platform
    // Here you would typically call your analytics service
    // Examples:
    // - Firebase Analytics: logEvent(analytics, eventName, properties)
    // - Google Analytics: gtag('event', eventName, properties)
    // - Custom solution: fetch to your own API

  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error);
  }
}; 