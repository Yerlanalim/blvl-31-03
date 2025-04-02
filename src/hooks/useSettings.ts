'use client';

import { useQuery, useMutation, useQueryClient, useQueryClient as getQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import {
  getUserSettings,
  updateUserSettings,
  getUserProfile,
  updateUserProfile,
  UserSettings,
  UserProfile
} from '@/lib/services/settings-service';

/**
 * Хук для получения настроек пользователя
 * @param userId - ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с данными настроек и состоянием запроса
 */
export const useSettings = (userId?: string) => {
  const { user, loading } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  // Автоматическая загрузка настроек при входе пользователя
  useEffect(() => {
    if (user && !loading) {
      queryClient.invalidateQueries({ queryKey: ['userSettings', user.uid] });
    }
  }, [user, loading, queryClient]);
  
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userSettings', effectiveUserId],
    queryFn: () => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return getUserSettings(effectiveUserId);
    },
    enabled: !!effectiveUserId && !loading,
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    settings,
    isLoading: isLoading || loading,
    error,
    refetch,
  };
};

/**
 * Хук для обновления настроек пользователя
 * @param userId - ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией обновления и состоянием мутации
 */
export const useUpdateSettings = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: updateSettings,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return updateUserSettings(effectiveUserId, newSettings);
    },
    onSuccess: () => {
      // Инвалидируем соответствующий запрос в кэше
      queryClient.invalidateQueries({ queryKey: ['userSettings', effectiveUserId] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', effectiveUserId] });
      
      // Показываем уведомление об успехе
      toast.success('Настройки успешно обновлены');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка обновления настроек: ${(error as Error).message}`);
    },
  });

  return {
    updateSettings,
    isPending,
    error,
    isSuccess,
    reset
  };
};

/**
 * Хук для получения профиля пользователя
 * @param userId - ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с данными профиля и состоянием запроса
 */
export const useUserProfile = (userId?: string) => {
  const { user, loading } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  // Автоматическая загрузка профиля при входе пользователя
  useEffect(() => {
    if (user && !loading) {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.uid] });
    }
  }, [user, loading, queryClient]);
  
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userProfile', effectiveUserId],
    queryFn: () => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return getUserProfile(effectiveUserId);
    },
    enabled: !!effectiveUserId && !loading,
    staleTime: 1000 * 60 * 5, // 5 минут кеширования
  });

  return {
    profile,
    isLoading: isLoading || loading,
    error,
    refetch,
  };
};

/**
 * Хук для обновления профиля пользователя
 * @param userId - ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с функцией обновления и состоянием мутации
 */
export const useUpdateUserProfile = (userId?: string) => {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  
  const {
    mutate: updateProfile,
    isPending,
    error,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: (profileData: Partial<UserProfile>) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return updateUserProfile(effectiveUserId, profileData);
    },
    onSuccess: () => {
      // Инвалидируем соответствующий запрос в кэше
      queryClient.invalidateQueries({ queryKey: ['userProfile', effectiveUserId] });
      queryClient.invalidateQueries({ queryKey: ['userSettings', effectiveUserId] });
      
      // Показываем уведомление об успехе
      toast.success('Профиль успешно обновлен');
    },
    onError: (error) => {
      // Показываем уведомление об ошибке
      toast.error(`Ошибка обновления профиля: ${(error as Error).message}`);
    },
  });

  return {
    updateProfile,
    isPending,
    error,
    isSuccess,
    reset
  };
}; 