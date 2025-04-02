'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, onAuthStateChanged, AuthError } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { 
  auth, 
  loginWithEmailAndPassword, 
  registerWithEmailAndPassword, 
  logout as firebaseLogout, 
  resetPassword as firebaseResetPassword,
  updateUserProfile 
} from '@/lib/firebase/auth';
import { getUserRole } from '@/lib/firebase/firestore';

// Определение типа контекста аутентификации
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  error: string | null;
  isAdmin: () => Promise<boolean>;
};

// Создание контекста с начальным значением
const AuthContext = createContext<AuthContextType | null>(null);

// Хук для безопасного использования контекста
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext должен использоваться внутри AuthProvider');
  }
  return context;
};

// Тип для отображения ошибок Firebase на русском языке
type FirebaseAuthErrorMessages = {
  [key: string]: string;
};

// Карта для преобразования кодов ошибок Firebase в понятные сообщения на русском
const firebaseAuthErrorMessages: FirebaseAuthErrorMessages = {
  'auth/email-already-in-use': 'Этот email уже используется другим аккаунтом',
  'auth/invalid-email': 'Некорректный формат email',
  'auth/user-disabled': 'Этот аккаунт отключен',
  'auth/user-not-found': 'Пользователь с таким email не найден',
  'auth/wrong-password': 'Неверный пароль',
  'auth/too-many-requests': 'Слишком много неудачных попыток входа. Попробуйте позже',
  'auth/weak-password': 'Пароль слишком простой. Используйте не менее 6 символов',
  'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету',
  'auth/invalid-credential': 'Неверные учетные данные',
  'auth/operation-not-allowed': 'Операция не разрешена',
  'auth/popup-closed-by-user': 'Всплывающее окно было закрыто пользователем',
  'auth/requires-recent-login': 'Требуется повторный вход для выполнения этой операции',
};

// Функция для получения понятного сообщения об ошибке на русском
const getErrorMessage = (error: FirebaseError): string => {
  return firebaseAuthErrorMessages[error.code] || error.message || 'Произошла ошибка аутентификации';
};

// Провайдер AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminStatus, setIsAdminStatus] = useState<boolean>(false);

  // Эффект для подписки на изменения состояния аутентификации
  useEffect(() => {
    // Подписка на слушатель onAuthStateChanged
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // Пользователь вошел в систему
        setUser(authUser);
      } else {
        // Пользователь вышел из системы
        setUser(null);
      }
      // Состояние загрузки завершено после проверки аутентификации
      setLoading(false);
    });

    // Отписка от слушателя при размонтировании компонента
    return () => unsubscribe();
  }, []);

  // Реализация функции входа в систему
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await loginWithEmailAndPassword(email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } else {
        setError('Произошла неизвестная ошибка при входе');
        console.error('Ошибка входа:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Реализация функции регистрации
  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Регистрация пользователя
      const userCredential = await registerWithEmailAndPassword(email, password);
      
      // Обновление профиля с displayName
      await updateUserProfile(displayName);
      
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } else {
        setError('Произошла неизвестная ошибка при регистрации');
        console.error('Ошибка регистрации:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Реализация функции выхода из системы
  const logout = async (): Promise<void> => {
    setError(null);
    
    try {
      await firebaseLogout();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } else {
        setError('Произошла ошибка при выходе из системы');
        console.error('Ошибка выхода:', error);
      }
      throw error;
    }
  };

  // Реализация функции сброса пароля
  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } else {
        setError('Произошла ошибка при отправке письма для сброса пароля');
        console.error('Ошибка сброса пароля:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Реализация функции обновления профиля
  const updateProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await updateUserProfile(displayName, photoURL);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } else {
        setError('Произошла ошибка при обновлении профиля');
        console.error('Ошибка обновления профиля:', error);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the current user has admin role
  const isAdmin = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const hasAdminRole = await getUserRole(user.uid);
      return hasAdminRole === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Значение контекста
  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    error,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 