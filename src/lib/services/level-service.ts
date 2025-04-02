import { 
  getDocumentById, 
  getDocuments, 
  LEVELS_COLLECTION 
} from '../firebase/firestore';
import { Level, LevelWithStatus, LevelStatus, UserProgress } from '@/types';
import { orderBy } from 'firebase/firestore';

/**
 * Получение списка всех уровней, отсортированных по полю order
 * @returns Promise со списком всех уровней
 */
export const getLevels = async (): Promise<Level[]> => {
  try {
    const levels = await getDocuments<Level>(
      LEVELS_COLLECTION,
      [orderBy('order', 'asc')]
    );
    return levels;
  } catch (error) {
    console.error('Ошибка при получении списка уровней:', error);
    throw error;
  }
};

/**
 * Получение информации о конкретном уровне по ID
 * @param levelId ID уровня
 * @returns Promise с данными уровня или null, если уровень не найден
 */
export const getLevelById = async (levelId: string): Promise<Level | null> => {
  try {
    const level = await getDocumentById<Level>(LEVELS_COLLECTION, levelId);
    return level;
  } catch (error) {
    console.error(`Ошибка при получении уровня ${levelId}:`, error);
    throw error;
  }
};

/**
 * Получение уровней с их статусом на основе прогресса пользователя
 * @param userProgress Прогресс пользователя
 * @returns Promise со списком уровней с добавленным полем status
 */
export const getLevelsWithStatus = async (userProgress: UserProgress): Promise<LevelWithStatus[]> => {
  try {
    const levels = await getLevels();
    
    return levels.map(level => {
      let status: LevelStatus;
      
      if (userProgress.completedLevelIds.includes(level.id)) {
        status = LevelStatus.Completed;
      } else if (
        level.id === userProgress.currentLevelId || 
        level.order < levels.find(l => l.id === userProgress.currentLevelId)?.order || 0
      ) {
        status = LevelStatus.Available;
      } else {
        status = LevelStatus.Locked;
      }
      
      return {
        ...level,
        status
      };
    });
  } catch (error) {
    console.error('Ошибка при получении уровней со статусом:', error);
    throw error;
  }
};

/**
 * Получение ID следующего уровня после текущего
 * @param currentLevelId ID текущего уровня
 * @returns Promise с ID следующего уровня или null, если следующего уровня нет
 */
export const getNextLevelId = async (currentLevelId: string): Promise<string | null> => {
  try {
    const levels = await getLevels();
    const currentLevel = levels.find(level => level.id === currentLevelId);
    
    if (!currentLevel) {
      throw new Error(`Уровень с ID ${currentLevelId} не найден`);
    }
    
    const nextLevel = levels.find(level => level.order === currentLevel.order + 1);
    return nextLevel ? nextLevel.id : null;
  } catch (error) {
    console.error(`Ошибка при получении ID следующего уровня после ${currentLevelId}:`, error);
    throw error;
  }
};

/**
 * Проверка, завершен ли уровень
 * @param userProgress Прогресс пользователя
 * @param levelId ID уровня
 * @returns true, если уровень завершен, иначе false
 */
export const isLevelCompleted = (userProgress: UserProgress, levelId: string): boolean => {
  return userProgress.completedLevelIds.includes(levelId);
}; 