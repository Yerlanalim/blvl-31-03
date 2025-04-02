'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import {
  getArtifacts,
  getArtifactById,
  createArtifact,
  updateArtifact,
  deleteArtifact,
  getArtifactsByIds,
  getLevelArtifacts,
  incrementArtifactDownloadCount
} from '@/lib/services/artifact-service';
import { Artifact } from '@/types';

/**
 * Hook for getting a list of artifacts with optional filtering
 * @param filters Optional filters for the artifacts
 * @returns An object with artifact data and query state
 */
export const useArtifacts = (filters?: { levelId?: string }) => {
  const {
    data: artifacts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['artifacts', filters],
    queryFn: async () => {
      try {
        return await getArtifacts(filters);
      } catch (error) {
        console.error('Error getting artifacts:', error);
        toast.error('Failed to load artifacts');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    artifacts,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for getting a specific artifact by ID
 * @param artifactId ID of the artifact
 * @returns An object with artifact data and query state
 */
export const useArtifact = (artifactId: string) => {
  const {
    data: artifact,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['artifact', artifactId],
    queryFn: async () => {
      try {
        return await getArtifactById(artifactId);
      } catch (error) {
        console.error(`Error getting artifact ${artifactId}:`, error);
        toast.error('Failed to load artifact');
        throw error;
      }
    },
    enabled: !!artifactId, // Only run the query if artifactId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    artifact,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for getting all artifacts for a specific level
 * @param levelId ID of the level
 * @returns An object with level artifacts data and query state
 */
export const useLevelArtifacts = (levelId: string) => {
  const {
    data: levelArtifacts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['levelArtifacts', levelId],
    queryFn: async () => {
      try {
        return await getLevelArtifacts(levelId);
      } catch (error) {
        console.error(`Error getting level artifacts for level ${levelId}:`, error);
        toast.error('Failed to load level artifacts');
        throw error;
      }
    },
    enabled: !!levelId, // Only run the query if levelId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    levelArtifacts,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook for creating a new artifact
 * @returns An object with mutation function and state
 */
export const useCreateArtifact = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async ({
      artifactData,
      file,
    }: {
      artifactData: Omit<Artifact, 'id' | 'downloadCount' | 'uploadedAt'>;
      file: File;
    }) => {
      return await createArtifact(artifactData, file);
    },
    onSuccess: () => {
      // Invalidate artifacts queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['levelArtifacts'] });
      
      // Show success notification
      toast.success('Artifact created successfully');
    },
    onError: (error) => {
      // Show error notification
      toast.error(`Error creating artifact: ${(error as Error).message}`);
    },
  });

  return {
    createArtifact: createArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  };
};

/**
 * Hook for updating an existing artifact
 * @returns An object with mutation function and state
 */
export const useUpdateArtifact = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async ({
      artifactId,
      artifactData,
      file,
    }: {
      artifactId: string;
      artifactData: Partial<Artifact>;
      file?: File;
    }) => {
      return await updateArtifact(artifactId, artifactData, file);
    },
    onSuccess: (_, variables) => {
      // Invalidate artifacts queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['artifact', variables.artifactId] });
      queryClient.invalidateQueries({ queryKey: ['levelArtifacts'] });
      
      // Show success notification
      toast.success('Artifact updated successfully');
    },
    onError: (error) => {
      // Show error notification
      toast.error(`Error updating artifact: ${(error as Error).message}`);
    },
  });

  return {
    updateArtifact: updateArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  };
};

/**
 * Hook for deleting an artifact
 * @returns An object with mutation function and state
 */
export const useDeleteArtifact = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: async (artifactId: string) => {
      return await deleteArtifact(artifactId);
    },
    onSuccess: (_, artifactId) => {
      // Invalidate artifacts queries to refresh the lists
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['artifact', artifactId] });
      queryClient.invalidateQueries({ queryKey: ['levelArtifacts'] });
      
      // Show success notification
      toast.success('Artifact deleted successfully');
    },
    onError: (error) => {
      // Show error notification
      toast.error(`Error deleting artifact: ${(error as Error).message}`);
    },
  });

  return {
    deleteArtifact: deleteArtifactMutation,
    isPending,
    error,
    isSuccess,
    reset,
  };
};

/**
 * Hook for downloading an artifact and tracking the download
 * @param artifactId ID of the artifact
 * @returns An object with download function and state
 */
export const useDownloadArtifact = (artifactId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { markAsDownloaded } = useProgress(user?.uid);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<Error | null>(null);

  // Get the artifact data
  const { artifact, isLoading: isLoadingArtifact } = useArtifact(artifactId);

  // Mutation for incrementing download count
  const {
    mutate: incrementDownloadCount,
    isPending: isIncrementing,
  } = useMutation({
    mutationFn: async (artifactId: string) => {
      return await incrementArtifactDownloadCount(artifactId);
    },
    onSuccess: () => {
      // Invalidate artifact queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['artifact', artifactId] });
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['levelArtifacts'] });
    },
    onError: (error) => {
      console.error(`Error incrementing download count for artifact ${artifactId}:`, error);
      // We don't show error toast here since the download might still be successful
    },
  });

  // Function to download the artifact
  const downloadArtifact = async () => {
    if (!artifact) {
      toast.error('Artifact data not available');
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Start downloading the file
      const response = await fetch(artifact.fileURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the file blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = artifact.fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Increment download count
      incrementDownloadCount(artifactId);

      // Mark artifact as downloaded in user progress if user is authenticated
      if (user) {
        markAsDownloaded({ artifactId });
      }

      // Show success notification
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading artifact:', error);
      setDownloadError(error as Error);
      toast.error(`Error downloading artifact: ${(error as Error).message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadArtifact,
    isDownloading: isDownloading || isIncrementing || isLoadingArtifact,
    error: downloadError,
    artifact
  };
}; 