import { 
  getDocumentById, 
  saveDocument, 
  updateDocument, 
  arrayUnionItem, 
  incrementCounter,
  USER_PROGRESS_COLLECTION, 
  ARTIFACTS_COLLECTION
} from '../firebase/firestore';
import { UserProgress, Badge, SkillType } from '@/types';
import { getNextLevelId } from './level-service';

/**
 * Создает начальный прогресс для нового пользователя
 * @param userId ID пользователя
 * @returns Promise без возвращаемого значения
 */
export const initializeUserProgress = async (userId: string): Promise<void> => {
  try {
    // Проверяем, существует ли уже прогресс для этого пользователя
    const existingProgress = await getDocumentById(USER_PROGRESS_COLLECTION, userId);
    
    if (existingProgress) {
      console.log(`Прогресс для пользователя ${userId} уже существует`);
      return;
    }
    
    // Создаем начальный прогресс
    const initialProgress: UserProgress = {
      userId,
      currentLevelId: 'level-1',
      completedLevelIds: [],
      watchedVideoIds: [],
      completedTestIds: [],
      downloadedArtifactIds: [],
      skillProgress: {} as Record<SkillType, number>,
      badges: [],
      lastUpdated: new Date()
    };
    
    // Инициализируем skillProgress для каждого типа навыка
    Object.values(SkillType).forEach(skill => {
      initialProgress.skillProgress[skill] = 0;
    });
    
    // Сохраняем прогресс в Firestore
    await saveDocument(USER_PROGRESS_COLLECTION, userId, initialProgress);
    
    console.log(`Прогресс для пользователя ${userId} успешно инициализирован`);
  } catch (error) {
    console.error(`Ошибка при инициализации прогресса пользователя ${userId}:`, error);
    throw error;
  }
};

/**
 * Получает прогресс пользователя из Firestore
 * @param userId ID пользователя
 * @returns Объект с прогрессом пользователя или null, если пользователь не найден
 */
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  try {
    const userProgress = await getDocumentById<UserProgress>(USER_PROGRESS_COLLECTION, userId);
    return userProgress;
  } catch (error) {
    console.error(`Ошибка при получении прогресса пользователя ${userId}:`, error);
    throw error;
  }
};

/**
 * Отмечает видео как просмотренное
 * @param userId ID пользователя
 * @param videoId ID видео
 * @returns Promise без возвращаемого значения
 */
export const markVideoWatched = async (userId: string, videoId: string): Promise<void> => {
  try {
    // Добавляем videoId в массив watchedVideoIds
    await arrayUnionItem(USER_PROGRESS_COLLECTION, userId, 'watchedVideoIds', videoId);
    
    // Обновляем lastUpdated
    await updateDocument(USER_PROGRESS_COLLECTION, userId, {
      lastUpdated: new Date()
    });
    
    console.log(`Видео ${videoId} отмечено как просмотренное для пользователя ${userId}`);
  } catch (error) {
    console.error(`Ошибка при отметке видео ${videoId} как просмотренного:`, error);
    throw error;
  }
};

/**
 * Отмечает тест как пройденный
 * @param userId ID пользователя
 * @param testId ID теста
 * @returns Promise без возвращаемого значения
 */
export const markTestCompleted = async (userId: string, testId: string): Promise<void> => {
  try {
    // Добавляем testId в массив completedTestIds
    await arrayUnionItem(USER_PROGRESS_COLLECTION, userId, 'completedTestIds', testId);
    
    // Обновляем lastUpdated
    await updateDocument(USER_PROGRESS_COLLECTION, userId, {
      lastUpdated: new Date()
    });
    
    console.log(`Тест ${testId} отмечен как пройденный для пользователя ${userId}`);
  } catch (error) {
    console.error(`Ошибка при отметке теста ${testId} как пройденного:`, error);
    throw error;
  }
};

/**
 * Отмечает артефакт как скачанный и увеличивает счетчик скачиваний
 * @param userId ID пользователя
 * @param artifactId ID артефакта
 * @returns Promise без возвращаемого значения
 */
export const markArtifactDownloaded = async (userId: string, artifactId: string): Promise<void> => {
  try {
    // Добавляем artifactId в массив downloadedArtifactIds
    await arrayUnionItem(USER_PROGRESS_COLLECTION, userId, 'downloadedArtifactIds', artifactId);
    
    // Обновляем lastUpdated
    await updateDocument(USER_PROGRESS_COLLECTION, userId, {
      lastUpdated: new Date()
    });
    
    // Увеличиваем счетчик скачиваний артефакта
    await incrementCounter(ARTIFACTS_COLLECTION, artifactId, 'downloadCount');
    
    console.log(`Артефакт ${artifactId} отмечен как скачанный для пользователя ${userId}`);
  } catch (error) {
    console.error(`Ошибка при отметке артефакта ${artifactId} как скачанного:`, error);
    throw error;
  }
};

/**
 * Завершает уровень и устанавливает следующий уровень как текущий
 * @param userId ID пользователя
 * @param levelId ID завершенного уровня
 * @returns Promise без возвращаемого значения
 */
export const completeLevel = async (userId: string, levelId: string): Promise<void> => {
  try {
    // Получаем текущий прогресс пользователя
    const userProgress = await getUserProgress(userId);
    
    if (!userProgress) {
      throw new Error(`Прогресс пользователя ${userId} не найден`);
    }
    
    // Получаем ID следующего уровня
    const nextLevelId = await getNextLevelId(levelId);
    
    // Обновляем прогресс
    const updateData: Partial<UserProgress> = {
      completedLevelIds: [...userProgress.completedLevelIds, levelId],
      lastUpdated: new Date()
    };
    
    // Обновляем currentLevelId только если есть следующий уровень
    if (nextLevelId !== null) {
      updateData.currentLevelId = nextLevelId;
    }
    
    await updateDocument(USER_PROGRESS_COLLECTION, userId, updateData);
    
    // Проверяем и выдаем значки
    await checkAndAwardBadges(userId, {
      ...userProgress,
      completedLevelIds: [...userProgress.completedLevelIds, levelId],
      currentLevelId: nextLevelId || userProgress.currentLevelId
    });
    
    console.log(`Уровень ${levelId} завершен для пользователя ${userId}${nextLevelId ? `, текущий уровень установлен на ${nextLevelId}` : ''}`);
  } catch (error) {
    console.error(`Ошибка при завершении уровня ${levelId}:`, error);
    throw error;
  }
};

/**
 * Проверяет условия и выдает значки пользователю
 * @param userId ID пользователя
 * @param userProgress Текущий прогресс пользователя
 * @returns Promise без возвращаемого значения
 */
export const checkAndAwardBadges = async (userId: string, userProgress: UserProgress): Promise<void> => {
  try {
    const badgesToAward: Badge[] = [];
    
    // Проверяем условия для выдачи значков
    
    // 1. Значок "Первый уровень пройден"
    if (userProgress.completedLevelIds.length >= 1 &&
        !userProgress.badges.some(badge => badge.id === 'first-level-completed')) {
      badgesToAward.push({
        id: 'first-level-completed',
        title: 'Первый уровень пройден',
        description: 'Вы успешно завершили свой первый уровень!',
        imageUrl: '/badges/first-level.svg',
        earnedAt: new Date()
      });
    }
    
    // В будущем здесь могут быть другие условия для выдачи значков
    
    // Если есть значки для выдачи, обновляем прогресс пользователя
    if (badgesToAward.length > 0) {
      const updatedBadges = [...userProgress.badges, ...badgesToAward];
      
      await updateDocument(USER_PROGRESS_COLLECTION, userId, {
        badges: updatedBadges,
        lastUpdated: new Date()
      });
      
      console.log(`Пользователю ${userId} выданы значки:`, badgesToAward.map(badge => badge.title).join(', '));
    }
  } catch (error) {
    console.error(`Ошибка при проверке и выдаче значков пользователю ${userId}:`, error);
    throw error;
  }
};

/**
 * Проверяет, доступен ли уровень пользователю
 * @param userProgress Прогресс пользователя
 * @param levelId ID уровня
 * @returns true, если уровень доступен, иначе false
 */
export const isLevelAvailable = (userProgress: UserProgress, levelId: string): boolean => {
  // Уровень доступен, если это текущий уровень или он уже пройден
  return userProgress.currentLevelId === levelId || userProgress.completedLevelIds.includes(levelId);
}; 