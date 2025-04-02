/**
 * Функции для управления редиректами при аутентификации
 */

const REDIRECT_KEY = 'auth_redirect_url';

/**
 * Сохраняет URL страницы, на которую нужно вернуться после аутентификации
 * 
 * @param url - URL, который нужно сохранить
 */
export const saveRedirectUrl = (url: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REDIRECT_KEY, url);
    }
  } catch (error) {
    console.error('Ошибка при сохранении URL редиректа:', error);
  }
};

/**
 * Получает сохраненный URL страницы, на которую нужно вернуться после аутентификации
 * 
 * @returns URL для редиректа или null, если URL не был сохранен
 */
export const getRedirectUrl = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REDIRECT_KEY);
    }
  } catch (error) {
    console.error('Ошибка при получении URL редиректа:', error);
  }
  return null;
};

/**
 * Удаляет сохраненный URL редиректа
 */
export const clearRedirectUrl = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REDIRECT_KEY);
    }
  } catch (error) {
    console.error('Ошибка при удалении URL редиректа:', error);
  }
};

/**
 * Создает URL для страницы аутентификации с параметром redirect
 * 
 * @param authPage - Тип страницы аутентификации (login, register)
 * @param redirectUrl - URL, на который нужно будет вернуться после аутентификации
 * @returns URL для страницы аутентификации с параметром редиректа
 */
export const createAuthUrlWithRedirect = (
  authPage: 'login' | 'register',
  redirectUrl: string
): string => {
  // Кодируем URL для безопасной передачи в параметрах
  const encodedRedirect = encodeURIComponent(redirectUrl);
  return `/${authPage}?redirect=${encodedRedirect}`;
};

/**
 * Извлекает URL редиректа из параметров URL текущей страницы
 * 
 * @returns URL для редиректа или null, если параметр отсутствует
 */
export const getRedirectFromUrl = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      return redirect ? decodeURIComponent(redirect) : null;
    }
  } catch (error) {
    console.error('Ошибка при извлечении параметра redirect:', error);
  }
  return null;
}; 