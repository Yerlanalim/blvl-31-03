'use client';

import { useSettingsContext as useContext } from '@/context/SettingsContext';

/**
 * Хук для удобного доступа к контексту настроек пользователя
 * @returns Объект с настройками и методами их обновления
 * @example
 * const { settings, updateTheme } = useSettingsContext();
 * // Обновление темы
 * updateTheme('dark');
 */
export function useSettingsContext() {
  return useContext();
}

export default useSettingsContext; 