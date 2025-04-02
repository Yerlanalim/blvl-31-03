import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getArtifactsAdmin, 
  createArtifact, 
  updateArtifact, 
  deleteArtifact,
  resetDownloadCount,
  getArtifactDownloadStats,
  getArtifactDownloadUsers,
  updateArtifactLevel
} from '@/lib/services/admin-service';
import { toast } from 'sonner';
import { Artifact } from '@/types';

/**
 * Hook for fetching artifacts for admin
 */
export function useAdminArtifacts() {
  return useQuery({
    queryKey: ['admin', 'artifacts'],
    queryFn: getArtifactsAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for creating a new artifact
 */
export function useCreateArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ artifact, file }: { artifact: Omit<Artifact, 'id' | 'downloadCount' | 'uploadedAt'>, file: File }) => 
      createArtifact(artifact, file),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'artifacts'] });
      // Also invalidate user-facing artifacts
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      
      toast.success('Артефакт успешно создан');
    },
    onError: (error) => {
      toast.error(`Ошибка при создании артефакта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for updating an artifact
 */
export function useUpdateArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      artifactId, 
      artifactData, 
      file 
    }: { 
      artifactId: string; 
      artifactData: Partial<Artifact>; 
      file?: File 
    }) => updateArtifact(artifactId, artifactData, file),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'artifacts'] });
      // Also invalidate user-facing artifacts
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      
      toast.success('Артефакт успешно обновлен');
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении артефакта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for deleting an artifact
 */
export function useDeleteArtifact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (artifactId: string) => deleteArtifact(artifactId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'artifacts'] });
      // Also invalidate user-facing artifacts
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      
      toast.success('Артефакт успешно удален');
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении артефакта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for resetting download count
 */
export function useResetDownloadCount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (artifactId: string) => resetDownloadCount(artifactId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'artifacts'] });
      
      toast.success('Счетчик скачиваний успешно сброшен');
    },
    onError: (error) => {
      toast.error(`Ошибка при сбросе счетчика: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for fetching artifact download statistics
 */
export function useArtifactStats(artifactId: string) {
  return useQuery({
    queryKey: ['admin', 'artifacts', artifactId, 'stats'],
    queryFn: () => getArtifactDownloadStats(artifactId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!artifactId, // Only run if we have an artifactId
  });
}

/**
 * Hook for fetching users who downloaded an artifact
 */
export function useArtifactUsers(artifactId: string) {
  return useQuery({
    queryKey: ['admin', 'artifacts', artifactId, 'users'],
    queryFn: () => getArtifactDownloadUsers(artifactId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!artifactId, // Only run if we have an artifactId
  });
}

/**
 * Hook for updating an artifact's associated level
 */
export function useUpdateArtifactLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      artifactId, 
      levelId 
    }: { 
      artifactId: string; 
      levelId: string;
    }) => updateArtifactLevel(artifactId, levelId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'artifacts'] });
      
      toast.success('Уровень артефакта успешно обновлен');
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении уровня артефакта: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
} 