/**
 * Service for managing levels data
 */
import { where, orderBy } from 'firebase/firestore';
import { Level, LevelStatus, LevelWithStatus, UserProgress } from '@/types';
import { LEVELS_COLLECTION } from '@/lib/firebase/firestore';
import { createFirebaseService } from '@/lib/utils/firebase/firebaseServiceFactory';
import { ErrorType } from '@/lib/utils/error-handling/errorHandler';

// Create the base level service using the factory
const levelService = createFirebaseService<Level>(LEVELS_COLLECTION);

/**
 * Get all levels sorted by order
 */
export const getLevels = async (): Promise<Level[]> => {
  return await levelService.getAll([orderBy('order', 'asc')]);
};

/**
 * Get a specific level by ID
 */
export const getLevelById = async (levelId: string): Promise<Level | null> => {
  return await levelService.getById(levelId);
};

/**
 * Get all levels with their status based on user progress
 */
export const getLevelsWithStatus = async (userProgress: UserProgress | null): Promise<LevelWithStatus[]> => {
  const levels = await getLevels();
  
  if (!userProgress) {
    // If no user progress, only the first level is available
    return levels.map((level, index) => {
      const status = index === 0 ? LevelStatus.Available : LevelStatus.Locked;
      return { ...level, status };
    });
  }

  return levels.map(level => {
    let status: LevelStatus;
    
    if (userProgress.completedLevelIds.includes(level.id)) {
      status = LevelStatus.Completed;
    } else if (userProgress.currentLevelId === level.id) {
      status = LevelStatus.Available;
    } else {
      status = LevelStatus.Locked;
    }
    
    return { ...level, status };
  });
};

/**
 * Get the next level ID based on current level
 */
export const getNextLevelId = async (currentLevelId: string): Promise<string | null> => {
  const levels = await getLevels();
  
  const currentLevelIndex = levels.findIndex(level => level.id === currentLevelId);
  
  if (currentLevelIndex === -1) {
    throw new Error(`Уровень с ID ${currentLevelId} не найден.`);
  }
  
  // If current level is the last one, return null (no next level)
  if (currentLevelIndex >= levels.length - 1) {
    return null;
  }
  
  // Return next level ID
  return levels[currentLevelIndex + 1].id;
};

/**
 * Check if a level is completed by the user
 */
export const isLevelCompleted = (userProgress: UserProgress | null, levelId: string): boolean => {
  if (!userProgress) return false;
  return userProgress.completedLevelIds.includes(levelId);
};

/**
 * Create a new level (admin only)
 */
export const createLevel = async (level: Omit<Level, 'id'>): Promise<string> => {
  return await levelService.create(level);
};

/**
 * Update an existing level (admin only)
 */
export const updateLevel = async (levelId: string, data: Partial<Level>): Promise<void> => {
  await levelService.update(levelId, data);
};

/**
 * Delete a level (admin only)
 */
export const deleteLevel = async (levelId: string): Promise<void> => {
  await levelService.remove(levelId);
}; 