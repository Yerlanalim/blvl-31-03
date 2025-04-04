import { ReportHandler } from 'web-vitals';
import * as Sentry from '@sentry/nextjs';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../firebase/config';

let analytics: any = null;

// Initialize Firebase Analytics if we're in the browser
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Failed to initialize Firebase Analytics:', error);
  }
}

/**
 * Reports Web Vitals metrics to various monitoring systems
 * 
 * @param metric The Web Vitals metric to report
 */
export function reportWebVitals(metric: any) {
  const { id, name, value, delta, rating } = metric;
  
  // Log metrics to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vitals: ${name} (${id})`, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      rating,
      delta: Math.round(delta),
    });
  }

  // Report to Sentry
  try {
    Sentry.captureMessage(`Web Vitals: ${name}`, {
      level: 'info',
      extra: {
        id,
        value: name === 'CLS' ? value * 1000 : value,
        delta,
        rating
      }
    });
  } catch (error) {
    console.error('Failed to report to Sentry:', error);
  }

  // Report to Firebase Analytics if available
  if (analytics) {
    try {
      logEvent(analytics, 'web_vitals', {
        metric_id: id,
        metric_name: name,
        metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
        metric_delta: Math.round(delta),
        metric_rating: rating,
      });
    } catch (error) {
      console.error('Failed to report to Firebase Analytics:', error);
    }
  }
}

/**
 * Track user interaction events for analytics
 * 
 * @param eventName Name of the event to track
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  // Skip in non-browser environments
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Analytics Event: ${eventName}`, eventParams);
  }
  
  // Track event with Sentry
  try {
    Sentry.addBreadcrumb({
      category: 'analytics',
      message: eventName,
      data: eventParams,
      level: 'info',
    });
  } catch (error) {
    console.error('Failed to add Sentry breadcrumb:', error);
  }
  
  // Track event with Firebase Analytics if available
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.error('Failed to log event to Firebase Analytics:', error);
    }
  }
}

/**
 * Track specific metrics about user interactions
 * 
 * @param metricName Name of the metric to track
 * @param value Value of the metric
 * @param metadata Additional metadata for the metric
 */
export function trackUserMetric(metricName: string, value: number, metadata: Record<string, any> = {}) {
  // Skip in non-browser environments
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`User Metric: ${metricName} = ${value}`, metadata);
  }
  
  // Track with Sentry
  try {
    Sentry.captureMessage(`User Metric: ${metricName}`, {
      level: 'info',
      extra: {
        value,
        ...metadata
      }
    });
  } catch (error) {
    console.error('Failed to track Sentry metric:', error);
  }
  
  // Track with Firebase Analytics if available
  if (analytics) {
    try {
      logEvent(analytics, 'user_metric', {
        metric_name: metricName,
        metric_value: value,
        ...metadata,
      });
    } catch (error) {
      console.error('Failed to log metric to Firebase Analytics:', error);
    }
  }
} 