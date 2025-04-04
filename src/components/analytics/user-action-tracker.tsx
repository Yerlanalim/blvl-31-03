'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/lib/utils/analytics';
import * as Sentry from '@sentry/nextjs';

interface UserActionTrackerProps {
  /**
   * Whether to track level-related actions
   */
  trackLevelActions?: boolean;
  
  /**
   * Whether to track artifact-related actions
   */
  trackArtifactActions?: boolean;
  
  /**
   * Whether to track chat-related actions
   */
  trackChatActions?: boolean;
  
  /**
   * List of actions to track
   */
  actions?: string[];
}

/**
 * Component that attaches event listeners to track user actions
 * by intercepting specific DOM events.
 * 
 * This component should be included in pages or layouts where you want
 * to track user actions automatically.
 */
export function UserActionTracker({
  trackLevelActions = true,
  trackArtifactActions = true,
  trackChatActions = true,
  actions = [],
}: UserActionTrackerProps) {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!window) return;
    
    // Set user context in Sentry if available
    if (user) {
      Sentry.setUser({
        id: user.uid,
        username: user.displayName || 'unknown',
      });
    }
    
    // Create a handler for click events on specific elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Helper to find a parent element with a specific attribute
      const findParentWithAttribute = (element: HTMLElement | null, attribute: string): HTMLElement | null => {
        if (!element) return null;
        if (element.hasAttribute(attribute)) return element;
        return element.parentElement ? findParentWithAttribute(element.parentElement, attribute) : null;
      };
      
      // Track level completion
      if (trackLevelActions) {
        const levelCompleteButton = findParentWithAttribute(target, 'data-level-complete');
        if (levelCompleteButton) {
          const levelId = levelCompleteButton.getAttribute('data-level-id') || 'unknown';
          trackEvent('level_completed', { level_id: levelId });
        }
        
        const levelStartButton = findParentWithAttribute(target, 'data-level-start');
        if (levelStartButton) {
          const levelId = levelStartButton.getAttribute('data-level-id') || 'unknown';
          trackEvent('level_started', { level_id: levelId });
        }
        
        const videoWatchedElement = findParentWithAttribute(target, 'data-video-watched');
        if (videoWatchedElement) {
          const videoId = videoWatchedElement.getAttribute('data-video-id') || 'unknown';
          const levelId = videoWatchedElement.getAttribute('data-level-id') || 'unknown';
          trackEvent('video_watched', { video_id: videoId, level_id: levelId });
        }
        
        const testCompletedElement = findParentWithAttribute(target, 'data-test-completed');
        if (testCompletedElement) {
          const testId = testCompletedElement.getAttribute('data-test-id') || 'unknown';
          const levelId = testCompletedElement.getAttribute('data-level-id') || 'unknown';
          trackEvent('test_completed', { test_id: testId, level_id: levelId });
        }
      }
      
      // Track artifact downloads
      if (trackArtifactActions) {
        const artifactDownloadElement = findParentWithAttribute(target, 'data-artifact-download');
        if (artifactDownloadElement) {
          const artifactId = artifactDownloadElement.getAttribute('data-artifact-id') || 'unknown';
          trackEvent('artifact_downloaded', { artifact_id: artifactId });
        }
      }
      
      // Track chat actions
      if (trackChatActions) {
        const chatMessageElement = findParentWithAttribute(target, 'data-chat-send');
        if (chatMessageElement) {
          trackEvent('chat_message_sent', {});
        }
        
        const chatClearElement = findParentWithAttribute(target, 'data-chat-clear');
        if (chatClearElement) {
          trackEvent('chat_history_cleared', {});
        }
      }
      
      // Track custom actions
      if (actions.length > 0) {
        for (const action of actions) {
          const actionElement = findParentWithAttribute(target, `data-track-${action}`);
          if (actionElement) {
            const actionData = {};
            
            // Collect all data attributes
            for (const attribute of actionElement.getAttributeNames()) {
              if (attribute.startsWith('data-param-')) {
                const paramName = attribute.replace('data-param-', '');
                actionData[paramName] = actionElement.getAttribute(attribute) || '';
              }
            }
            
            trackEvent(action, actionData);
          }
        }
      }
    };
    
    // Attach the click event listener
    document.addEventListener('click', handleClick);
    
    // Clean up listener when component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
      
      // Clear user context from Sentry
      Sentry.setUser(null);
    };
  }, [user, trackLevelActions, trackArtifactActions, trackChatActions, actions]);
  
  // This component doesn't render anything
  return null;
}

export default UserActionTracker; 