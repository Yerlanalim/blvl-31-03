import { useAuthContext, AuthContextType } from '@/context/AuthContext';

/**
 * Хук useAuth предоставляет удобный доступ к контексту аутентификации.
 * Возвращает все свойства и методы из AuthContext.
 *
 * @returns {AuthContextType} Объект с состоянием и функциями аутентификации
 * @throws {Error} Если используется вне AuthProvider
 *
 * @example
 * const { user, loading, login, logout } = useAuth();
 *
 * if (loading) return <LoadingSpinner />;
 *
 * if (user) {
 *   return <button onClick={logout}>Выйти</button>;
 * } else {
 *   return <button onClick={() => login('email@example.com', 'password')}>Войти</button>;
 * }
 */
export const useAuth = (): AuthContextType => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth; 