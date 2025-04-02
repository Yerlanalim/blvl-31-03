import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getUserProgress,
  initializeUserProgress,
  markVideoWatched,
  markTestCompleted,
  markArtifactDownloaded,
  completeLevel
} from '../progress-service';
import * as FirestoreModule from '@/lib/firebase/firestore';
import * as LevelService from '../level-service';
import { SkillType } from '@/types';

// Мокируем Firestore функции
vi.mock('@/lib/firebase/firestore', () => ({
  getDocumentById: vi.fn(),
  setDocument: vi.fn(),
  updateDocument: vi.fn(),
  USER_PROGRESS_COLLECTION: 'userProgress',
  serverTimestamp: vi.fn(() => new Date()),
  arrayUnion: vi.fn((...args) => args)
}));

// Мокируем level-service
vi.mock('../level-service', () => ({
  getNextLevelId: vi.fn()
}));

describe('progress-service', () => {
  const userId = 'user-1';
  
  // Мок данные для прогресса пользователя
  const mockUserProgress = {
    userId: 'user-1',
    currentLevelId: 'level-1',
    completedLevelIds: [],
    watchedVideoIds: ['video-1'],
    completedTestIds: ['test-1'],
    downloadedArtifactIds: ['artifact-1'],
    skillProgress: { [SkillType.Management]: 10 },
    badges: [],
    lastUpdated: new Date()
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getUserProgress', () => {
    it('should return user progress', async () => {
      vi.mocked(FirestoreModule.getDocumentById).mockResolvedValue(mockUserProgress);
      
      const result = await getUserProgress(userId);
      
      expect(FirestoreModule.getDocumentById).toHaveBeenCalledWith('userProgress', userId);
      expect(result).toEqual(mockUserProgress);
    });

    it('should return null when progress not found', async () => {
      vi.mocked(FirestoreModule.getDocumentById).mockResolvedValue(null);
      
      const result = await getUserProgress(userId);
      
      expect(result).toBeNull();
    });
  });

  describe('initializeUserProgress', () => {
    it('should initialize user progress', async () => {
      vi.mocked(FirestoreModule.setDocument).mockResolvedValue(undefined);
      
      await initializeUserProgress(userId);
      
      expect(FirestoreModule.setDocument).toHaveBeenCalledWith(
        'userProgress', 
        userId, 
        expect.objectContaining({
          userId,
          currentLevelId: 'level-1',
          completedLevelIds: [],
          watchedVideoIds: [],
          completedTestIds: [],
          downloadedArtifactIds: [],
          skillProgress: {},
          badges: []
        })
      );
    });
  });

  describe('markVideoWatched', () => {
    it('should mark video as watched', async () => {
      vi.mocked(FirestoreModule.updateDocument).mockResolvedValue(undefined);
      
      await markVideoWatched(userId, 'video-2');
      
      expect(FirestoreModule.updateDocument).toHaveBeenCalledWith(
        'userProgress',
        userId,
        expect.objectContaining({
          watchedVideoIds: expect.anything(),
          lastUpdated: expect.anything()
        })
      );
    });
  });

  describe('markTestCompleted', () => {
    it('should mark test as completed', async () => {
      vi.mocked(FirestoreModule.updateDocument).mockResolvedValue(undefined);
      
      await markTestCompleted(userId, 'test-2');
      
      expect(FirestoreModule.updateDocument).toHaveBeenCalledWith(
        'userProgress',
        userId,
        expect.objectContaining({
          completedTestIds: expect.anything(),
          lastUpdated: expect.anything()
        })
      );
    });
  });

  describe('markArtifactDownloaded', () => {
    it('should mark artifact as downloaded', async () => {
      vi.mocked(FirestoreModule.updateDocument).mockResolvedValue(undefined);
      
      await markArtifactDownloaded(userId, 'artifact-2');
      
      expect(FirestoreModule.updateDocument).toHaveBeenCalledWith(
        'userProgress',
        userId,
        expect.objectContaining({
          downloadedArtifactIds: expect.anything(),
          lastUpdated: expect.anything()
        })
      );
    });
  });

  describe('completeLevel', () => {
    it('should complete level and update current level to next level', async () => {
      vi.mocked(LevelService.getNextLevelId).mockResolvedValue('level-2');
      vi.mocked(FirestoreModule.updateDocument).mockResolvedValue(undefined);
      
      await completeLevel(userId, 'level-1');
      
      expect(LevelService.getNextLevelId).toHaveBeenCalledWith('level-1');
      expect(FirestoreModule.updateDocument).toHaveBeenCalledWith(
        'userProgress',
        userId,
        expect.objectContaining({
          completedLevelIds: expect.anything(),
          currentLevelId: 'level-2',
          lastUpdated: expect.anything()
        })
      );
    });

    it('should handle case when there is no next level', async () => {
      vi.mocked(LevelService.getNextLevelId).mockResolvedValue(null);
      vi.mocked(FirestoreModule.updateDocument).mockResolvedValue(undefined);
      
      await completeLevel(userId, 'level-3');
      
      expect(FirestoreModule.updateDocument).toHaveBeenCalledWith(
        'userProgress',
        userId,
        expect.objectContaining({
          completedLevelIds: expect.anything(),
          // currentLevelId не должен меняться
          lastUpdated: expect.anything()
        })
      );
    });
  });
}); 