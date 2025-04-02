import { getDocumentById, saveDocument, updateDocument, UserDocument } from '../firebase/firestore';
import { Timestamp } from 'firebase/firestore';

/**
 * Типы для настроек пользователя
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

/**
 * Расширенная информация о пользователе
 */
export interface UserProfile {
  displayName: string | null;
  photoURL: string | null;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
}

/**
 * Получает настройки пользователя из Firestore
 * @param userId ID пользователя
 * @returns Объект с настройками пользователя или null, если пользователь не найден
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const userDoc = await getDocumentById<UserDocument>('users', userId);
    
    if (!userDoc) {
      return null;
    }
    
    // Преобразуем формат настроек из БД в формат UserSettings
    const settings: UserSettings = {
      theme: userDoc.settings.theme,
      notificationsEnabled: userDoc.settings.notifications,
      emailNotificationsEnabled: userDoc.settings.emailNotifications
    };
    
    return settings;
  } catch (error) {
    console.error('Ошибка при получении настроек пользователя:', error);
    throw error;
  }
};

/**
 * Обновляет настройки пользователя в Firestore
 * @param userId ID пользователя
 * @param settings Новые настройки пользователя (частичный объект)
 * @returns Promise без возвращаемого значения
 */
export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    // Получаем текущие настройки, чтобы обновить только измененные поля
    const userDoc = await getDocumentById<UserDocument>('users', userId);
    
    if (!userDoc) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }
    
    // Преобразуем настройки в формат, который хранится в Firebase
    const updatedSettings: Partial<UserDocument['settings']> = {};
    
    if (settings.theme !== undefined) {
      updatedSettings.theme = settings.theme;
    }
    
    if (settings.notificationsEnabled !== undefined) {
      updatedSettings.notifications = settings.notificationsEnabled;
    }
    
    if (settings.emailNotificationsEnabled !== undefined) {
      updatedSettings.emailNotifications = settings.emailNotificationsEnabled;
    }
    
    // Обновляем только поле settings
    await updateDocument('users', userId, {
      settings: {
        ...userDoc.settings,
        ...updatedSettings
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении настроек пользователя:', error);
    throw error;
  }
};

/**
 * Получает полный профиль пользователя из Firestore
 * @param userId ID пользователя
 * @returns Объект с профилем пользователя или null, если пользователь не найден
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDocumentById<UserDocument>('users', userId);
    
    if (!userDoc) {
      return null;
    }
    
    // Преобразуем формат из БД в формат UserProfile
    const profile: UserProfile = {
      displayName: userDoc.displayName,
      photoURL: userDoc.photoURL,
      email: userDoc.email,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
      settings: {
        theme: userDoc.settings.theme,
        notificationsEnabled: userDoc.settings.notifications,
        emailNotificationsEnabled: userDoc.settings.emailNotifications
      }
    };
    
    return profile;
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    throw error;
  }
};

/**
 * Обновляет профиль пользователя в Firestore
 * @param userId ID пользователя
 * @param profileData Новые данные профиля пользователя (частичный объект)
 * @returns Promise без возвращаемого значения
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const updateData: Partial<UserDocument> = {};
    
    // Копируем базовые поля
    if (profileData.displayName !== undefined) {
      updateData.displayName = profileData.displayName;
    }
    
    if (profileData.photoURL !== undefined) {
      updateData.photoURL = profileData.photoURL;
    }
    
    // Если переданы настройки, преобразуем их в формат БД
    if (profileData.settings) {
      const currentSettings = await getUserSettings(userId);
      
      if (!currentSettings) {
        throw new Error(`Пользователь с ID ${userId} не найден`);
      }
      
      // Объединяем текущие настройки с новыми
      updateData.settings = {
        theme: profileData.settings.theme || currentSettings.theme,
        notifications: profileData.settings.notificationsEnabled !== undefined 
          ? profileData.settings.notificationsEnabled 
          : currentSettings.notificationsEnabled,
        emailNotifications: profileData.settings.emailNotificationsEnabled !== undefined 
          ? profileData.settings.emailNotificationsEnabled 
          : currentSettings.emailNotificationsEnabled
      };
    }
    
    // Обновляем документ пользователя
    if (Object.keys(updateData).length > 0) {
      await updateDocument('users', userId, updateData);
    }
  } catch (error) {
    console.error('Ошибка при обновлении профиля пользователя:', error);
    throw error;
  }
}; 