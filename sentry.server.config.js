// This file configures the initialization of Sentry on the server side (Node.js)
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

Sentry.init({
  dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // Set the environment based on your deployment
  environment: ENVIRONMENT,
  // Enable profiling
  profilesSampleRate: 0.1,
  // Enable debug mode in development
  debug: ENVIRONMENT === 'development',
  // Disable Serverless functions info collection to avoid health check noise
  autoDiscoverNodePerformanceMonitoringIntegrations: true,
  // Configure beforeSend to sanitize sensitive information
  beforeSend(event) {
    // You can modify the event here to remove sensitive data
    if (event.user) {
      // Don't send email addresses
      delete event.user.email;
      // Don't send IP addresses
      delete event.user.ip_address;
    }
    return event;
  },
}); 