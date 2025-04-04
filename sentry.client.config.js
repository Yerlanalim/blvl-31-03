// This file configures the initialization of Sentry on the client side (browser)
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

Sentry.init({
  dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // Set the environment based on your deployment
  environment: ENVIRONMENT,
  // Enable performance monitoring
  integrations: [
    new Sentry.BrowserTracing({
      // Set sampling rate for transactions
      // This sets the sample rate at 10%. You may want 100% for development
      tracePropagationTargets: ['localhost', /^https:\/\/bizlevel\.vercel\.app/],
    }),
    new Sentry.Replay({
      // Capture 10% of all sessions
      sessionSampleRate: 0.1, 
      // Capture 100% of sessions with an error
      errorSampleRate: 1.0,
    }),
  ],
  // We recommend adjusting this value in production
  replaysSessionSampleRate: 0.1,
  // If you're not already sampling the entire session, change the sample rate
  // to 100% when sampling sessions where errors occur
  replaysOnErrorSampleRate: 1.0,
  
  // Enable debug mode in development
  debug: ENVIRONMENT === 'development',
  
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