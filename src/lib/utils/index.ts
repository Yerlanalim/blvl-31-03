/**
 * Export all utilities from a central location
 * This simplifies imports by allowing:
 * import { handleError, createQueryHook, ... } from '@/lib/utils';
 */

// Export error handling utilities
export * from './error-handling/errorHandler';

// Export hook utilities
export * from './hooks/createQueryHook';

// Export Firebase service factory
export * from './firebase/firebaseServiceFactory';

// Export component state utilities
export * from './components/stateUtils';

// Export notification utilities
export * from './notifications/notificationUtils';

// Export form utilities
export * from './forms/formUtils';

// Re-export existing utilities from utils.ts
export { cn } from '@/lib/utils';

// Re-export other utility files in this directory
export * from './parallel-fetch';
export * from './dynamic-import';
export * from './date-utils';
export * from './auth-redirect'; 