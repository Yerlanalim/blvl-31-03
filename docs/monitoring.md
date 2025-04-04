# BizLevel Monitoring System Documentation

This document describes the monitoring system set up for the BizLevel project, including error tracking, performance monitoring, and user analytics.

## Table of Contents

1. [Overview](#overview)
2. [Monitoring Tools](#monitoring-tools)
3. [Error Tracking](#error-tracking)
4. [Performance Monitoring](#performance-monitoring)
5. [User Interaction Tracking](#user-interaction-tracking)
6. [API Monitoring](#api-monitoring)
7. [Dashboard and Alerts](#dashboard-and-alerts)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

The BizLevel monitoring system combines several tools and approaches to ensure high-quality user experience, stable performance, and quick identification of issues. The system includes:

- Error tracking and reporting with Sentry
- Performance monitoring of Core Web Vitals
- User interaction tracking with Firebase Analytics
- API request monitoring and logging
- Custom alerts and notifications

## Monitoring Tools

### Primary Tools

- **Sentry**: Used for error tracking, performance monitoring, and session replay
- **Firebase Analytics**: Used for user behavior analytics and custom event tracking
- **Web Vitals**: Used for monitoring Core Web Vitals metrics
- **Custom monitoring utilities**: Used for API and component-level tracking

### Configuration

All the monitoring tools are configured in the following files:

- `sentry.client.config.js`: Client-side Sentry configuration
- `sentry.server.config.js`: Server-side Sentry configuration
- `sentry.edge.config.js`: Edge runtime Sentry configuration
- `next.config.ts`: Integration of Sentry with Next.js, including source maps
- `src/lib/utils/analytics.ts`: Analytics utility functions
- `src/components/analytics/`: Analytics-related components

## Error Tracking

### Error Boundary Component

The `ErrorBoundary` component (`src/components/ui/error-boundary.tsx`) catches React rendering errors and provides a fallback UI. Usage example:

```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Manual Error Tracking

For errors that aren't caught by React's error boundaries (e.g., in event handlers, async code), use the manual error tracking methods:

```tsx
import * as Sentry from '@sentry/nextjs';

try {
  // Your code that might throw an error
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'ComponentName' },
    extra: { additionalContext: 'value' },
  });
}
```

### Error Tracking Utilities

The `error-tracking.ts` utility provides helper functions for tracking errors in various contexts:

- `withErrorTracking()`: HOF for wrapping async functions with error tracking
- `withAPIErrorTracking()`: HOF for wrapping API route handlers with error tracking
- `trackError()`: Function for manually tracking errors with context

## Performance Monitoring

### Core Web Vitals

The `WebVitals` component (`src/components/analytics/web-vitals.tsx`) tracks Core Web Vitals metrics:

- Largest Contentful Paint (LCP)
- First Input Delay (FID) / Interaction to Next Paint (INP)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

These metrics are reported to both Sentry and Firebase Analytics.

### Navigation Performance

The `NavigationTracker` component (`src/components/analytics/navigation-tracker.tsx`) tracks user navigation performance and behavior:

- Time spent on pages
- Navigation patterns
- Performance between page transitions

### Custom Performance Metrics

Use the `trackUserMetric` function to track custom performance metrics:

```tsx
import { trackUserMetric } from '@/lib/utils/analytics';

// Track time to perform an action
trackUserMetric('custom_operation_time', timeInMs, {
  operation: 'operationName',
  context: 'additionalContext',
});
```

## User Interaction Tracking

### User Action Tracker

The `UserActionTracker` component (`src/components/analytics/user-action-tracker.tsx`) automatically tracks key user actions by monitoring DOM events on elements with specific data attributes:

- Level completion: Elements with `data-level-complete` attribute
- Video watching: Elements with `data-video-watched` attribute
- Test completion: Elements with `data-test-completed` attribute
- Artifact downloads: Elements with `data-artifact-download` attribute
- Chat interactions: Elements with `data-chat-send` or `data-chat-clear` attributes
- Custom actions: Elements with `data-track-{action-name}` attributes

### Manual Event Tracking

Use the `trackEvent` function to manually track user events:

```tsx
import { trackEvent } from '@/lib/utils/analytics';

// Track a custom event
trackEvent('button_clicked', {
  button_id: 'submit-form',
  page: 'profile',
});
```

### Component-level Analytics

The `useAnalyticsTracker` hook provides component-level interaction tracking:

```tsx
import { useAnalyticsTracker } from '@/hooks/useAnalyticsTracker';

function MyComponent() {
  const { trackInteractionStart, trackInteractionEnd, trackComponentEvent } = 
    useAnalyticsTracker('MyComponent');
    
  // Use these functions to track interactions
}
```

## API Monitoring

### API Monitoring Utilities

The `api-monitoring.ts` utility provides tools for monitoring API endpoints:

- `withAPIMonitoring()`: HOF for wrapping API route handlers with monitoring
- `createMonitoredResponse()`: Function for creating responses with performance tracking

### Sample Implementation

```tsx
import { withAPIMonitoring } from '@/lib/utils/api-monitoring';

async function myApiHandler(req) {
  // Handler implementation
}

export const GET = withAPIMonitoring(myApiHandler, {
  name: 'my-api-endpoint',
  shouldTrackPerformance: true,
  shouldTrackErrors: true,
});
```

## Dashboard and Alerts

### Sentry Dashboard

- **URL**: [https://sentry.io/organizations/bizlevel/issues/](https://sentry.io/organizations/bizlevel/issues/) (requires login)
- **Key Metrics**: Error rate, affected users, performance metrics
- **Projects**: Frontend, Backend, Edge

### Firebase Analytics Dashboard

- **URL**: [https://console.firebase.google.com/project/bizlevel/analytics](https://console.firebase.google.com/project/bizlevel/analytics) (requires login)
- **Key Metrics**: User engagement, conversion rates, retention, custom events
- **Reports**: User acquisition, behavior flow, retention

### Alert Configuration

Alerts are configured for the following scenarios:

1. **Error Spikes**: Notification when error rate exceeds normal levels
2. **Performance Degradation**: Alert when Core Web Vitals metrics deteriorate
3. **API Failures**: Alert when API success rate drops below threshold
4. **User Impact**: Notification when errors affect multiple users

## Best Practices

### When Adding New Components

1. Wrap complex components with `ErrorBoundary` to ensure graceful failure
2. Add appropriate data attributes for user action tracking
3. Use the `withAnalytics` HOC for page-level components
4. Monitor performance with `useAnalyticsTracker` for interactive components

### When Adding New API Routes

1. Use `withAPIMonitoring` to track performance and errors
2. Include appropriate context information in error reports
3. Return standardized error responses

### General Guidelines

1. **Privacy First**: Don't log sensitive user information (PII, credentials)
2. **Performance Impact**: Keep monitoring lightweight to avoid affecting user experience
3. **Actionable Data**: Focus on metrics that help identify and fix real issues
4. **Progressive Enhancement**: Make sure the app works even if monitoring fails

## Troubleshooting

### Common Issues

1. **Missing error reports in Sentry**:
   - Verify Sentry DSN is correctly set in environment variables
   - Check for errors in browser console related to Sentry initialization
   - Ensure source maps are correctly configured

2. **Missing or incomplete analytics data**:
   - Check Firebase Analytics initialization
   - Verify tracking calls in browser network tab
   - Look for console errors related to analytics

3. **Performance monitoring issues**:
   - Ensure the WebVitals component is included in the app layout
   - Check for conflicts with other performance measuring tools
   - Verify that web-vitals package is correctly installed

### Support Resources

- Sentry Documentation: [https://docs.sentry.io/](https://docs.sentry.io/)
- Firebase Analytics Documentation: [https://firebase.google.com/docs/analytics](https://firebase.google.com/docs/analytics)
- Web Vitals Documentation: [https://web.dev/articles/vitals](https://web.dev/articles/vitals)

## Maintenance

Regular monitoring system maintenance should include:

1. Reviewing and triaging error reports (weekly)
2. Analyzing performance trends (bi-weekly)
3. Updating monitoring configuration for new features (as needed)
4. Reviewing and refining alert thresholds (monthly)
5. Clean up of stale or irrelevant data (quarterly) 