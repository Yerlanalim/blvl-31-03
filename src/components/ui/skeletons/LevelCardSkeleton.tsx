'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

const LevelCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden" data-testid="skeleton">
      <div className="relative h-40 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-1" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  );
};

export default LevelCardSkeleton; 