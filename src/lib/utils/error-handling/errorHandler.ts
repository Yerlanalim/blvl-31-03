/**
 * Centralized error handling utilities
 * Provides standardized error handling functions for the application
 */
import { toast } from 'sonner';

/**
 * Standard error types in the application
 */
export enum ErrorType {
  Authentication = 'Authentication',
  Database = 'Database',
  Network = 'Network',
  Validation = 'Validation',
  NotFound = 'NotFound',
  Permission = 'Permission',
  Unknown = 'Unknown'
}

/**
 * Standardized error structure
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  code?: string;
}

/**
 * Create a standardized error object from any error
 */
export function createAppError(error: unknown, defaultType: ErrorType = ErrorType.Unknown): AppError {
  if (error instanceof Error) {
    // Firebase auth errors have a code property
    const firebaseError = error as any;
    if (firebaseError.code) {
      if (firebaseError.code.startsWith('auth/')) {
        return {
          type: ErrorType.Authentication,
          message: getFirebaseAuthErrorMessage(firebaseError.code),
          originalError: error,
          code: firebaseError.code
        };
      } else if (firebaseError.code.startsWith('firestore/')) {
        return {
          type: ErrorType.Database,
          message: getFirestoreErrorMessage(firebaseError.code),
          originalError: error,
          code: firebaseError.code
        };
      } else if (firebaseError.code.startsWith('storage/')) {
        return {
          type: ErrorType.Database, 
          message: getStorageErrorMessage(firebaseError.code),
          originalError: error,
          code: firebaseError.code
        };
      }
    }

    return {
      type: defaultType,
      message: error.message || 'An error occurred',
      originalError: error
    };
  }

  return {
    type: defaultType,
    message: error?.toString() || 'An unknown error occurred'
  };
}

/**
 * Handle any error with standardized logging and notification
 */
export function handleError(error: unknown, defaultType: ErrorType = ErrorType.Unknown): AppError {
  const appError = createAppError(error, defaultType);
  
  // Log to console
  console.error(`[${appError.type}] ${appError.message}`, appError.originalError || '');
  
  // Show toast notification
  toast.error(appError.message);
  
  return appError;
}

/**
 * Create a wrapped async function with standardized error handling
 */
export function withErrorHandling<T>(
  fn: (...args: any[]) => Promise<T>,
  errorType: ErrorType = ErrorType.Unknown
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorType);
      throw error;
    }
  };
}

/**
 * Get user-friendly message for Firebase Auth error codes
 */
function getFirebaseAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'Your account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return `Authentication error: ${code}`;
  }
}

/**
 * Get user-friendly message for Firestore error codes
 */
function getFirestoreErrorMessage(code: string): string {
  switch (code) {
    case 'firestore/permission-denied':
      return 'You do not have permission to perform this action.';
    case 'firestore/not-found':
      return 'The requested document was not found.';
    case 'firestore/already-exists':
      return 'The document already exists.';
    case 'firestore/cancelled':
      return 'The operation was cancelled.';
    default:
      return `Database error: ${code}`;
  }
}

/**
 * Get user-friendly message for Storage error codes
 */
function getStorageErrorMessage(code: string): string {
  switch (code) {
    case 'storage/unauthorized':
      return 'You do not have permission to access this file.';
    case 'storage/canceled':
      return 'The file operation was cancelled.';
    case 'storage/unknown':
      return 'An unknown error occurred while accessing the file.';
    default:
      return `Storage error: ${code}`;
  }
} 