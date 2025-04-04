/**
 * Standardized notification utilities
 * Centralizes all toast notifications for consistent formatting and behavior
 */
import { toast, ToastT, ExternalToast } from 'sonner';

// Types for notification variation
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Standard notification options with defaults
export interface NotificationOptions extends Omit<ExternalToast, 'description'> {
  description?: string;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

// Default options for different notification types
const defaultOptions: Record<NotificationType, NotificationOptions> = {
  success: { duration: 3000 },
  error: { duration: 5000 },
  warning: { duration: 4000 },
  info: { duration: 3000 }
};

/**
 * Show a notification with standardized formatting
 */
export function showNotification(
  message: string,
  type: NotificationType = 'info',
  options: NotificationOptions = {}
): ToastT {
  const mergedOptions = { ...defaultOptions[type], ...options };
  
  switch (type) {
    case 'success':
      return toast.success(message, mergedOptions);
    case 'error':
      return toast.error(message, mergedOptions);
    case 'warning':
      return toast.warning(message, mergedOptions);
    case 'info':
      return toast.info(message, mergedOptions);
    default:
      return toast(message, mergedOptions);
  }
}

/**
 * Show a success notification
 */
export function notifySuccess(message: string, options: NotificationOptions = {}): ToastT {
  return showNotification(message, 'success', options);
}

/**
 * Show an error notification
 */
export function notifyError(message: string, options: NotificationOptions = {}): ToastT {
  return showNotification(message, 'error', options);
}

/**
 * Show a warning notification
 */
export function notifyWarning(message: string, options: NotificationOptions = {}): ToastT {
  return showNotification(message, 'warning', options);
}

/**
 * Show an information notification
 */
export function notifyInfo(message: string, options: NotificationOptions = {}): ToastT {
  return showNotification(message, 'info', options);
}

/**
 * Standard notification messages to ensure consistency
 */
export const NOTIFICATION_MESSAGES = {
  // Authentication messages
  AUTH: {
    LOGIN_SUCCESS: 'Successfully logged in',
    LOGOUT_SUCCESS: 'Successfully logged out',
    REGISTRATION_SUCCESS: 'Account created successfully',
    PASSWORD_RESET_SENT: 'Password reset instructions sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    PROFILE_UPDATED: 'Profile updated successfully'
  },
  
  // Data operations
  DATA: {
    SAVED: 'Data saved successfully',
    UPDATED: 'Updated successfully',
    DELETED: 'Deleted successfully',
    LOADED: 'Data loaded successfully',
    ERROR_LOADING: 'Failed to load data',
    ERROR_SAVING: 'Failed to save data',
    ERROR_UPDATING: 'Failed to update data',
    ERROR_DELETING: 'Failed to delete data'
  },
  
  // Progress-related messages
  PROGRESS: {
    LEVEL_COMPLETED: 'Level completed successfully!',
    TEST_COMPLETED: 'Test completed successfully',
    VIDEO_WATCHED: 'Video marked as watched',
    ARTIFACT_DOWNLOADED: 'Artifact downloaded successfully',
    BADGE_EARNED: 'New badge earned!'
  },
  
  // Admin operations
  ADMIN: {
    ITEM_CREATED: 'Item created successfully',
    ITEM_UPDATED: 'Item updated successfully',
    ITEM_DELETED: 'Item deleted successfully',
    USER_UPDATED: 'User updated successfully'
  }
};

/**
 * Format a notification with dynamic values
 * Example: formatNotification("Hello, {name}!", { name: "John" }) => "Hello, John!"
 */
export function formatNotification(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(new RegExp(`{${key}}`, 'g'), String(value)),
    template
  );
} 