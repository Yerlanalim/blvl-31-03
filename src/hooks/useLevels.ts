'use client';

import { Level, LevelWithStatus, UserProgress } from '@/types';
import { 
  getLevels, 
  getLevelById, 
  getLevelsWithStatus, 
  getNextLevelId 
} from '@/lib/services/level-service';
import { createQueryHook } from '@/lib/utils/hooks/createQueryHook';
import { useProgress } from './useProgress';
import { ErrorType } from '@/lib/utils/error-handling/errorHandler';
import { toast } from 'sonner';

// Cache times
const LEVELS_STALE_TIME = 1000 * 60 * 30; // 30 minutes for static levels data
const LEVEL_DETAILS_STALE_TIME = 1000 * 60 * 10; // 10 minutes for level details

/**
 * Hook for fetching all levels
 */
export const useLevels = createQueryHook(
  () => ['levels'],
  getLevels,
  { staleTime: LEVELS_STALE_TIME },
  ErrorType.Database
);

/**
 * Hook for fetching a specific level by ID
 */
export const useLevel = createQueryHook<Level | null, Error, [string]>(
  (levelId) => ['level', levelId],
  getLevelById,
  { staleTime: LEVEL_DETAILS_STALE_TIME },
  ErrorType.Database
);

/**
 * Hook for fetching levels with status based on user progress
 */
export const useLevelsWithStatus = () => {
  const { progress } = useProgress();
  
  const levelsQuery = createQueryHook<LevelWithStatus[], Error, [UserProgress | null]>(
    (userProgress) => ['levelsWithStatus', userProgress?.userId || 'anonymous'],
    getLevelsWithStatus,
    { staleTime: LEVELS_STALE_TIME },
    ErrorType.Database
  )(progress);
  
  return {
    levelsWithStatus: levelsQuery.data,
    isLoading: levelsQuery.isLoading,
    error: levelsQuery.error,
    refetch: levelsQuery.refetch
  };
};

/**
 * Hook for fetching the next level based on current level ID
 */
export const useNextLevel = (currentLevelId: string | undefined) => {
  const {
    data: nextLevelId,
    isLoading,
    error,
  } = createQueryHook<string, Error, [string]>(
    (levelId) => ['nextLevel', levelId],
    getNextLevelId,
    { staleTime: LEVELS_STALE_TIME, enabled: !!currentLevelId },
    ErrorType.Database
  )(currentLevelId as string);
  
  const nextLevelQuery = useLevel(nextLevelId || '');
  
  return {
    nextLevelId,
    nextLevel: nextLevelQuery.data,
    isLoading: isLoading || nextLevelQuery.isLoading,
    error: error || nextLevelQuery.error
  };
}; 