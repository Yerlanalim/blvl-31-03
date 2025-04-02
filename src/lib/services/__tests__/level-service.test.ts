import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getLevels, 
  getLevelById, 
  getLevelsWithStatus, 
  getNextLevelId,
  isLevelCompleted 
} from '../level-service';
import * as FirestoreModule from '@/lib/firebase/firestore';
import { LevelStatus, SkillType } from '@/types';

// Мокируем Firestore функции
vi.mock('@/lib/firebase/firestore', () => ({
  getDocumentById: vi.fn(),
  getDocuments: vi.fn(),
  LEVELS_COLLECTION: 'levels',
  orderBy: vi.fn()
}));

describe('level-service', () => {
  // Мок-данные для уровней
  const mockLevels = [
    {
      id: 'level-1',
      title: 'Уровень 1',
      description: 'Описание уровня 1',
      order: 1,
      videoContent: [],
      tests: [],
      relatedArtifactIds: [],
      completionCriteria: {
        videosRequired: 3,
        testsRequired: 1
      },
      skillFocus: [SkillType.Management]
    },
    {
      id: 'level-2',
      title: 'Уровень 2',
      description: 'Описание уровня 2',
      order: 2,
      videoContent: [],
      tests: [],
      relatedArtifactIds: [],
      completionCriteria: {
        videosRequired: 3,
        testsRequired: 1
      },
      skillFocus: [SkillType.Finance]
    },
    {
      id: 'level-3',
      title: 'Уровень 3',
      description: 'Описание уровня 3',
      order: 3,
      videoContent: [],
      tests: [],
      relatedArtifactIds: [],
      completionCriteria: {
        videosRequired: 3,
        testsRequired: 1
      },
      skillFocus: [SkillType.Marketing]
    }
  ];

  // Мок данные для прогресса пользователя
  const mockUserProgress = {
    userId: 'user-1',
    currentLevelId: 'level-2',
    completedLevelIds: ['level-1'],
    watchedVideoIds: [],
    completedTestIds: [],
    downloadedArtifactIds: [],
    skillProgress: {},
    badges: [],
    lastUpdated: new Date()
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getLevels', () => {
    it('should return all levels sorted by order', async () => {
      vi.mocked(FirestoreModule.getDocuments).mockResolvedValue(mockLevels);
      
      const result = await getLevels();
      
      expect(FirestoreModule.getDocuments).toHaveBeenCalledWith(
        'levels',
        [expect.anything()]
      );
      expect(result).toEqual(mockLevels);
      expect(result.length).toBe(3);
    });

    it('should throw an error when Firestore fails', async () => {
      const mockError = new Error('Firestore error');
      vi.mocked(FirestoreModule.getDocuments).mockRejectedValue(mockError);
      
      await expect(getLevels()).rejects.toThrow('Firestore error');
    });
  });

  describe('getLevelById', () => {
    it('should return a specific level by ID', async () => {
      vi.mocked(FirestoreModule.getDocumentById).mockResolvedValue(mockLevels[0]);
      
      const result = await getLevelById('level-1');
      
      expect(FirestoreModule.getDocumentById).toHaveBeenCalledWith('levels', 'level-1');
      expect(result).toEqual(mockLevels[0]);
    });

    it('should return null when level not found', async () => {
      vi.mocked(FirestoreModule.getDocumentById).mockResolvedValue(null);
      
      const result = await getLevelById('non-existent');
      
      expect(result).toBeNull();
    });

    it('should throw an error when Firestore fails', async () => {
      const mockError = new Error('Firestore error');
      vi.mocked(FirestoreModule.getDocumentById).mockRejectedValue(mockError);
      
      await expect(getLevelById('level-1')).rejects.toThrow('Firestore error');
    });
  });

  describe('getLevelsWithStatus', () => {
    it('should add correct status to each level based on user progress', async () => {
      vi.mocked(FirestoreModule.getDocuments).mockResolvedValue(mockLevels);
      
      const result = await getLevelsWithStatus(mockUserProgress);
      
      expect(result.length).toBe(3);
      // Уровень 1 должен быть помечен как завершенный
      expect(result[0].status).toBe(LevelStatus.Completed);
      // Уровень 2 должен быть доступен (текущий)
      expect(result[1].status).toBe(LevelStatus.Available);
      // Уровень 3 должен быть заблокирован
      expect(result[2].status).toBe(LevelStatus.Locked);
    });
  });

  describe('getNextLevelId', () => {
    it('should return the next level ID', async () => {
      vi.mocked(FirestoreModule.getDocuments).mockResolvedValue(mockLevels);
      
      const result = await getNextLevelId('level-1');
      
      expect(result).toBe('level-2');
    });

    it('should return null if no next level exists', async () => {
      vi.mocked(FirestoreModule.getDocuments).mockResolvedValue(mockLevels);
      
      const result = await getNextLevelId('level-3');
      
      expect(result).toBeNull();
    });

    it('should throw an error if current level not found', async () => {
      vi.mocked(FirestoreModule.getDocuments).mockResolvedValue(mockLevels);
      
      await expect(getNextLevelId('non-existent')).rejects.toThrow('не найден');
    });
  });

  describe('isLevelCompleted', () => {
    it('should return true if level is completed', () => {
      const result = isLevelCompleted(mockUserProgress, 'level-1');
      
      expect(result).toBe(true);
    });

    it('should return false if level is not completed', () => {
      const result = isLevelCompleted(mockUserProgress, 'level-2');
      
      expect(result).toBe(false);
    });
  });
}); 