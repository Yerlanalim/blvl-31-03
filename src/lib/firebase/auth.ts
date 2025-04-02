import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  AuthError,
  UserCredential
} from 'firebase/auth';
import { app } from './config';
import { createUserDocument } from './firestore';

// Получаем инстанс Auth
const auth = getAuth(app);

// Функция для получения текущего пользователя, обернутая в Promise
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Вход пользователя с помощью email и пароля
 * @param email Email пользователя
 * @param password Пароль пользователя
 * @returns Promise с результатом авторизации
 */
export const loginWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Регистрация нового пользователя с помощью email и пароля и создание записи в Firestore
 * @param email Email пользователя
 * @param password Пароль пользователя
 * @returns Promise с результатом регистрации
 */
export const registerWithEmailAndPassword = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    // Регистрируем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Если регистрация прошла успешно, создаем документ пользователя в Firestore
    if (userCredential.user) {
      await createUserDocument(userCredential.user.uid, {
        email: userCredential.user.email || email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    throw error;
  }
};

/**
 * Выход пользователя из системы
 * @returns Promise без возвращаемого значения
 */
export const logout = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Отправка письма для сброса пароля на указанный email
 * @param email Email пользователя для сброса пароля
 * @returns Promise без возвращаемого значения
 */
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

/**
 * Обновление профиля пользователя (имя и/или фото)
 * @param displayName Отображаемое имя пользователя (опционально)
 * @param photoURL URL фотографии пользователя (опционально)
 * @returns Promise без возвращаемого значения
 */
export const updateUserProfile = async (
  displayName?: string, 
  photoURL?: string
): Promise<void> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('Пользователь не аутентифицирован');
  }

  return updateProfile(currentUser, {
    displayName: displayName || currentUser.displayName,
    photoURL: photoURL || currentUser.photoURL
  });
};

// Экспортируем auth для использования в других файлах
export { auth }; 