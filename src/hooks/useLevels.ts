'use client';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import {
  getLevels,
  getLevelById,
  getLevelsWithStatus,
  getNextLevelId
} from '@/lib/services/level-service';
import { Level, LevelWithStatus } from '@/types';

/**
 * Хук для получения списка всех уровней
 * @returns Объект с данными о всех уровнях и состоянием запроса
 */
export const useLevels = () => {
  const {
    data: levels,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      try {
        return await getLevels();
      } catch (error) {
        console.error('Ошибка при получении списка уровней:', error);
        toast.error('Не удалось загрузить список уровней');
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    levels,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Хук для получения информации о конкретном уровне по ID
 * @param levelId ID уровня
 * @returns Объект с данными об уровне и состоянием запроса
 */
export const useLevel = (levelId: string) => {
  const {
    data: level,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['level', levelId],
    queryFn: async () => {
      try {
        return await getLevelById(levelId);
      } catch (error) {
        console.error(`Ошибка при получении уровня ${levelId}:`, error);
        toast.error('Не удалось загрузить информацию об уровне');
        throw error;
      }
    },
    enabled: !!levelId, // Запрос выполняется только при наличии levelId
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    level,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Хук для получения списка уровней с их статусом на основе прогресса пользователя
 * @returns Объект с данными о уровнях со статусом и состоянием запроса
 */
export const useLevelsWithStatus = () => {
  const { user } = useAuth();
  const { progress, isLoading: isProgressLoading } = useProgress();
  
  const {
    data: levelsWithStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['levelsWithStatus', user?.uid],
    queryFn: async () => {
      try {
        if (!progress) {
          throw new Error('Прогресс пользователя не загружен');
        }
        return await getLevelsWithStatus(progress);
      } catch (error) {
        console.error('Ошибка при получении уровней со статусом:', error);
        toast.error('Не удалось загрузить карту уровней');
        throw error;
      }
    },
    enabled: !!progress && !isProgressLoading, // Запрос выполняется только при наличии прогресса
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    levelsWithStatus,
    isLoading: isLoading || isProgressLoading,
    error,
    refetch,
  };
};

/**
 * Хук для получения информации о следующем уровне
 * @param currentLevelId ID текущего уровня
 * @returns Объект с данными о следующем уровне и состоянием запроса
 */
export const useNextLevel = (currentLevelId: string) => {
  const {
    data: nextLevel,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nextLevel', currentLevelId],
    queryFn: async () => {
      try {
        // Получаем ID следующего уровня
        const nextLevelId = await getNextLevelId(currentLevelId);
        
        // Если следующего уровня нет, возвращаем null
        if (!nextLevelId) {
          return null;
        }
        
        // Получаем данные о следующем уровне
        return await getLevelById(nextLevelId);
      } catch (error) {
        console.error(`Ошибка при получении следующего уровня после ${currentLevelId}:`, error);
        toast.error('Не удалось загрузить информацию о следующем уровне');
        throw error;
      }
    },
    enabled: !!currentLevelId, // Запрос выполняется только при наличии currentLevelId
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    nextLevel,
    isLoading,
    error,
    refetch,
  };
}; 