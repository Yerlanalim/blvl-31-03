'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChatSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* User message */}
        <div className="flex items-start justify-end gap-2 mb-4">
          <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>

        {/* AI response */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="bg-muted rounded-lg p-3 max-w-[80%]">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-4 w-56 mb-1" />
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start justify-end gap-2 mb-4">
          <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        </div>

        {/* AI response with thinking animation */}
        <div className="flex items-start gap-2">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="bg-muted rounded-lg p-3 max-w-[80%]">
            <div className="flex space-x-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ChatSkeleton; 