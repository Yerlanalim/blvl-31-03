'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const FaqSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="pb-2 mb-4 border-b">
        <Skeleton className="h-8 w-1/3 mb-2" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          {i % 2 === 0 && (
            <div className="mt-4 space-y-2 pt-2 border-t">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqSkeleton; 