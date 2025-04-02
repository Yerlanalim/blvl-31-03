'use client';

import { useState } from 'react';
import { Artifact } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid, List } from 'lucide-react';
import { DownloadableArtifactCard } from './DownloadableArtifactCard';

interface ArtifactsListProps {
  artifacts: Artifact[] | undefined;
  isLoading: boolean;
}

export function ArtifactsList({ artifacts, isLoading }: ArtifactsListProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  
  if (isLoading) {
    return <ArtifactsListSkeleton layout={layout} />;
  }
  
  if (!artifacts || artifacts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Артефакты не найдены</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground mr-2">Вид:</span>
          <Button
            variant={layout === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('grid')}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Сетка</span>
          </Button>
          <Button
            variant={layout === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLayout('list')}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Список</span>
          </Button>
        </div>
      </div>
      
      <div className={
        layout === 'grid' 
          ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
      }>
        {artifacts.map((artifact) => (
          <DownloadableArtifactCard
            key={artifact.id}
            artifact={artifact}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

interface ArtifactsListSkeletonProps {
  layout: 'grid' | 'list';
}

function ArtifactsListSkeleton({ layout }: ArtifactsListSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className={
        layout === 'grid' 
          ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'space-y-4'
      }>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton 
            key={index} 
            className={layout === 'grid' ? 'h-64' : 'h-40'} 
          />
        ))}
      </div>
    </div>
  );
} 