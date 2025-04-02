'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { UserSettings } from '@/lib/services/settings-service';

interface SettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  updateTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  updateNotifications: (notificationsEnabled: boolean) => Promise<void>;
  updateEmailNotifications: (emailNotificationsEnabled: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const { settings, isLoading, refetch } = useSettings(user?.uid);
  const { updateSettings, isPending } = useUpdateSettings(user?.uid);
  const [initialized, setInitialized] = useState(false);

  // Синхронизация темы при изменении настроек
  useEffect(() => {
    if (settings && !isPending && !initialized) {
      setTheme(settings.theme);
      setInitialized(true);
    }
  }, [settings, setTheme, isPending, initialized]);

  // Обновление контекста при смене пользователя
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    if (!user) return;

    setTheme(theme);
    await updateSettings({ theme });
  };

  const updateNotifications = async (notificationsEnabled: boolean) => {
    if (!user) return;

    await updateSettings({ notificationsEnabled });
  };

  const updateEmailNotifications = async (emailNotificationsEnabled: boolean) => {
    if (!user) return;

    await updateSettings({ emailNotificationsEnabled });
  };

  const value = {
    settings: settings || null,
    isLoading,
    updateTheme,
    updateNotifications,
    updateEmailNotifications,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
} 