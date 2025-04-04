import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProgress } from '../useProgress';
import * as ProgressService from '@/lib/services/progress-service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { LevelStatus, SkillType } from '@/types';

// Мокируем хук useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { uid: 'test-user-id' },
    loading: false
  }))
}));

// Мокируем сервисы прогресса
vi.mock('@/lib/services/progress-service', () => ({
  getUserProgress: vi.fn(),
  initializeUserProgress: vi.fn(),
  markVideoWatched: vi.fn(),
  markTestCompleted: vi.fn(),
  markArtifactDownloaded: vi.fn(),
  completeLevel: vi.fn()
}));

// Создаем обертку для провайдеров
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProgress hook', () => {
  const mockUserProgress = {
    userId: 'test-user-id',
    currentLevelId: 'level-1',
    completedLevelIds: ['level-0'],
    watchedVideoIds: ['video-1', 'video-2'],
    completedTestIds: ['test-1'],
    downloadedArtifactIds: ['artifact-1'],
    skillProgress: {},
    badges: [],
    lastUpdated: new Date()
  };

  const mockLevel = {
    id: 'level-1',
    title: 'Уровень 1',
    description: 'Описание уровня 1',
    order: 1,
    videoContent: [
      { id: 'video-1', title: 'Видео 1', url: 'url1', duration: 120 },
      { id: 'video-2', title: 'Видео 2', url: 'url2', duration: 180 },
      { id: 'video-3', title: 'Видео 3', url: 'url3', duration: 240 }
    ],
    tests: [
      { id: 'test-1', title: 'Тест 1', questions: [] },
      { id: 'test-2', title: 'Тест 2', questions: [] }
    ],
    relatedArtifactIds: ['artifact-1', 'artifact-2'],
    completionCriteria: {
      videosRequired: 3,
      testsRequired: 2
    },
    skillFocus: [SkillType.Management]
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(ProgressService.getUserProgress).mockResolvedValue(mockUserProgress);
  });

  it('should fetch user progress on mount', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProgress(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(ProgressService.getUserProgress).toHaveBeenCalledWith('test-user-id');
    expect(result.current.progress).toEqual(mockUserProgress);
  });

  it('should initialize user progress if not exist', async () => {
    // Симулируем отсутствие прогресса
    vi.mocked(ProgressService.getUserProgress)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockUserProgress);
    
    vi.mocked(ProgressService.initializeUserProgress).mockResolvedValue(undefined);
    
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProgress(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(ProgressService.initializeUserProgress).toHaveBeenCalledWith('test-user-id');
    expect(ProgressService.getUserProgress).toHaveBeenCalledTimes(2);
    expect(result.current.progress).toEqual(mockUserProgress);
  });

  it('should check if video is watched', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProgress(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isVideoWatched('video-1')).toBe(true);
    expect(result.current.isVideoWatched('video-3')).toBe(false);
  });

  it('should check if test is completed', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProgress(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isTestCompleted('test-1')).toBe(true);
    expect(result.current.isTestCompleted('test-2')).toBe(false);
  });

  it('should check if level can be completed', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProgress(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Не должен разрешать завершение, так как просмотрено только 2 из 3 требуемых видео
    // и выполнен только 1 из 2 требуемых тестов
    const completionCheck = result.current.canCompleteLevelCheck('level-1', mockLevel);
    expect(completionCheck.canComplete).toBe(false);
    expect(completionCheck.reason).toContain('Необходимо просмотреть как минимум 3 видео');
  });
}); 