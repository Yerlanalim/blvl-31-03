import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLevelsAdmin, 
  createLevel, 
  updateLevel, 
  deleteLevel, 
  reorderLevels 
} from '@/lib/services/admin-service';
import { toast } from 'sonner';
import { Level } from '@/types';

/**
 * Hook for fetching levels for admin
 */
export function useAdminLevels() {
  return useQuery({
    queryKey: ['admin', 'levels'],
    queryFn: getLevelsAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for creating a new level
 */
export function useCreateLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (levelData: Omit<Level, 'id'>) => createLevel(levelData),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] });
      toast.success('Уровень успешно создан');
    },
    onError: (error) => {
      toast.error(`Ошибка при создании уровня: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for updating a level
 */
export function useUpdateLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ levelId, levelData }: { levelId: string; levelData: Partial<Level> }) => 
      updateLevel(levelId, levelData),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] });
      // Also invalidate regular levels for user-facing pages
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      
      toast.success('Уровень успешно обновлен');
    },
    onError: (error) => {
      toast.error(`Ошибка при обновлении уровня: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for deleting a level
 */
export function useDeleteLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (levelId: string) => deleteLevel(levelId),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] });
      // Also invalidate regular levels for user-facing pages
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      
      toast.success('Уровень успешно удален');
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении уровня: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
}

/**
 * Hook for reordering levels
 */
export function useReorderLevels() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (levelIds: string[]) => reorderLevels(levelIds),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'levels'] });
      // Also invalidate regular levels for user-facing pages
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      
      toast.success('Порядок уровней успешно обновлен');
    },
    onError: (error) => {
      toast.error(`Ошибка при изменении порядка уровней: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  });
} 