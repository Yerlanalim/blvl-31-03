'use client';

import { useState } from 'react';
import { Artifact } from '@/types';
import { ArtifactCard } from './ArtifactCard';
import { useDownloadArtifact } from '@/hooks/useArtifacts';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';

interface DownloadableArtifactCardProps {
  artifact: Artifact;
  layout?: 'grid' | 'list';
}

export function DownloadableArtifactCard({ artifact, layout = 'grid' }: DownloadableArtifactCardProps) {
  const { id: artifactId } = artifact;
  const { downloadArtifact, isDownloading } = useDownloadArtifact(artifactId);
  
  const { user } = useAuth();
  const { isArtifactDownloaded } = useProgress(user?.uid);
  
  const isDownloaded = isArtifactDownloaded(artifactId);
  
  const handleDownload = async () => {
    // Prevent download if already downloaded or currently downloading
    if (isDownloaded || isDownloading) return;
    
    try {
      await downloadArtifact();
    } catch (error) {
      // Error handling is already done in the useDownloadArtifact hook
      console.error('Download error in component:', error);
    }
  };
  
  return (
    <ArtifactCard
      artifact={artifact}
      onDownload={handleDownload}
      isDownloaded={isDownloaded}
      isDownloading={isDownloading}
      layout={layout}
    />
  );
} 