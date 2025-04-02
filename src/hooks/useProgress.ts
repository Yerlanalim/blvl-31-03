'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import {
  getUserProgress,
  initializeUserProgress,
  markVideoWatched,
  markTestCompleted,
  markArtifactDownloaded,
  completeLevel
} from '@/lib/services/progress-service';
import { Level, UserProgress } from '@/types';

/**
 * Основной хук для работы с прогрессом пользователя
 * @param userId ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с данными о прогрессе, состоянием запроса и вспомогательными функциями
 */
export const useProgress = (userId?: string) => {
  const { user, loading } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  // Автоматическая загрузка прогресса при входе пользователя
  useEffect(() => {
    if (user && !loading) {
      queryClient.invalidateQueries({ queryKey: ['userProgress', user.uid] });
    }
  }, [user, loading, queryClient]);
  
  const {
    data: progress,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userProgress', effectiveUserId],
    queryFn: async () => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      
      // Получаем прогресс пользователя
      const userProgress = await getUserProgress(effectiveUserId);
      
      // Если прогресса нет, инициализируем его
      if (!userProgress) {
        await initializeUserProgress(effectiveUserId);
        return await getUserProgress(effectiveUserId);
      }
      
      return userProgress;
    },
    enabled: !!effectiveUserId && !loading,
    staleTime: 1000 * 60, // 1 минута кеширования
  });

  // Вспомогательные функции для проверки состояний
  const isVideoWatched = (videoId: string): boolean => {
    if (!progress) return false;
    return progress.watchedVideoIds.includes(videoId);
  };

  const isTestCompleted = (testId: string): boolean => {
    if (!progress) return false;
    return progress.completedTestIds.includes(testId);
  };

  const isArtifactDownloaded = (artifactId: string): boolean => {
    if (!progress) return false;
    return progress.downloadedArtifactIds.includes(artifactId);
  };

  const isLevelCompleted = (levelId: string): boolean => {
    if (!progress) return false;
    return progress.completedLevelIds.includes(levelId);
  };

  const canCompleteLevelCheck = (levelId: string, level: Level): { canComplete: boolean; reason?: string } => {
    if (!progress) {
      return { canComplete: false, reason: 'Прогресс не загружен' };
    }

    if (isLevelCompleted(levelId)) {
      return { canComplete: false, reason: 'Уровень уже завершен' };
    }

    if (progress.currentLevelId !== levelId) {
      return { canComplete: false, reason: 'Это не текущий уровень' };
    }

    const { videosRequired, testsRequired } = level.completionCriteria;
    const watchedVideosInLevel = level.videoContent.filter(video => 
      isVideoWatched(video.id)
    ).length;

    const completedTestsInLevel = level.tests.filter(test => 
      isTestCompleted(test.id)
    ).length;

    if (watchedVideosInLevel < videosRequired) {
      return { 
        canComplete: false, 
        reason: `Необходимо просмотреть как минимум ${videosRequired} видео. Просмотрено: ${watchedVideosInLevel}` 
      };
    }

    if (completedTestsInLevel < testsRequired) {
      return { 
        canComplete: false, 
        reason: `Необходимо пройти как минимум ${testsRequired} тестов. Пройдено: ${completedTestsInLevel}` 
      };
    }

    return { canComplete: true };
  };

  return {
    progress,
    isLoading: isLoading || loading,
    error,
    refetch,
    isVideoWatched,
    isTestCompleted,
    isArtifactDownloaded,
    isLevelCompleted,
    canCompleteLevelCheck
  };
};

/**
 * Хук для отметки видео как просмотренного
 * @param userId ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией мутации и её состоянием
 */
export const useMarkVideoWatched = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: markAsWatched,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (videoId: string) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return markVideoWatched(effectiveUserId, videoId);
    },
    onSuccess: () => {
      // Инвалидируем кэш прогресса пользователя
      queryClient.invalidateQueries({ queryKey: ['userProgress', effectiveUserId] });
      
      // Показываем уведомление об успехе
      toast.success('Видео отмечено как просмотренное');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка при отметке видео: ${(error as Error).message}`);
    },
  });

  return {
    markAsWatched,
    isPending,
    error,
    isSuccess,
    reset
  };
};

/**
 * Хук для отметки теста как пройденного
 * @param userId ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией мутации и её состоянием
 */
export const useMarkTestCompleted = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: markAsCompleted,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (testId: string) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return markTestCompleted(effectiveUserId, testId);
    },
    onSuccess: () => {
      // Инвалидируем кэш прогресса пользователя
      queryClient.invalidateQueries({ queryKey: ['userProgress', effectiveUserId] });
      
      // Показываем уведомление об успехе
      toast.success('Тест отмечен как пройденный');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка при отметке теста: ${(error as Error).message}`);
    },
  });

  return {
    markAsCompleted,
    isPending,
    error,
    isSuccess,
    reset
  };
};

/**
 * Хук для отметки артефакта как скачанного
 * @param userId ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией мутации и её состоянием
 */
export const useMarkArtifactDownloaded = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: markAsDownloaded,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (artifactId: string) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return markArtifactDownloaded(effectiveUserId, artifactId);
    },
    onSuccess: () => {
      // Инвалидируем кэш прогресса пользователя
      queryClient.invalidateQueries({ queryKey: ['userProgress', effectiveUserId] });
      
      // Инвалидируем также кэш артефактов, т.к. увеличивается счетчик скачиваний
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
      
      // Показываем уведомление об успехе
      toast.success('Артефакт отмечен как скачанный');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка при отметке артефакта: ${(error as Error).message}`);
    },
  });

  return {
    markAsDownloaded,
    isPending,
    error,
    isSuccess,
    reset
  };
};

/**
 * Хук для завершения уровня
 * @param userId ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией мутации и её состоянием
 */
export const useCompleteLevel = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: completeCurrentLevel,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: ({ levelId, nextLevelId }: { levelId: string; nextLevelId: string }) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return completeLevel(effectiveUserId, levelId, nextLevelId);
    },
    onSuccess: () => {
      // Инвалидируем кэш прогресса пользователя
      queryClient.invalidateQueries({ queryKey: ['userProgress', effectiveUserId] });
      
      // Показываем уведомление об успехе
      toast.success('Уровень успешно завершен!');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка при завершении уровня: ${(error as Error).message}`);
    },
  });

  return {
    completeCurrentLevel,
    isPending,
    error,
    isSuccess,
    reset
  };
}; 