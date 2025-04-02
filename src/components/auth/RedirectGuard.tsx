'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { saveRedirectUrl, createAuthUrlWithRedirect } from '@/lib/utils/auth-redirect';

interface RedirectGuardProps {
  children: React.ReactNode;
  isAuthRequired?: boolean;
  fallbackPath?: string;
}

/**
 * Компонент для защиты маршрутов и перенаправления пользователей
 * в зависимости от их статуса аутентификации
 * 
 * @param children - Дочерние компоненты для рендеринга, если условие выполнено
 * @param isAuthRequired - Требуется ли аутентификация для доступа (по умолчанию true)
 * @param fallbackPath - Путь для перенаправления (по умолчанию '/login' или '/map')
 */
export function RedirectGuard({
  children,
  isAuthRequired = true,
  fallbackPath,
}: RedirectGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Ждем завершения проверки аутентификации

    // Если требуется аутентификация, но пользователь не аутентифицирован
    if (isAuthRequired && !user) {
      const currentPath = window.location.pathname;
      saveRedirectUrl(currentPath); // Сохраняем текущий URL

      // Перенаправляем на страницу входа
      const redirectPath = fallbackPath || '/login';
      router.push(redirectPath);
    }

    // Если НЕ требуется аутентификация, но пользователь аутентифицирован
    if (!isAuthRequired && user) {
      // Перенаправляем на домашнюю страницу
      const redirectPath = fallbackPath || '/map';
      router.push(redirectPath);
    }
  }, [user, loading, isAuthRequired, fallbackPath, router]);

  // Если загрузка - показываем индикатор
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Если требуется аутентификация и пользователь аутентифицирован
  // ИЛИ если не требуется аутентификация и пользователь не аутентифицирован
  if ((isAuthRequired && user) || (!isAuthRequired && !user)) {
    return <>{children}</>;
  }

  // В других случаях не рендерим ничего, так как будет выполнен редирект
  return null;
}

export default RedirectGuard; 