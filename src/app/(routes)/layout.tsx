'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { saveRedirectUrl, createAuthUrlWithRedirect } from '@/lib/utils/auth-redirect';
import MainLayout from '@/components/layout/MainLayout';
import { UserActionTracker } from '@/components/analytics/user-action-tracker';

interface RoutesLayoutProps {
  children: React.ReactNode;
}

export default function RoutesLayout({ children }: RoutesLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Если пользователь не аутентифицирован, перенаправляем на /login
  useEffect(() => {
    if (!user && !loading) {
      // Сохраняем текущий URL для последующего редиректа
      saveRedirectUrl(pathname);
      
      // Перенаправляем на страницу входа
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Показываем индикатор загрузки, пока проверяется состояние аутентификации
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, не отображаем содержимое
  // Редирект в useEffect сработает автоматически
  if (!user) {
    return null;
  }

  // Если пользователь аутентифицирован, показываем содержимое приложения в MainLayout
  return (
    <MainLayout>
      {children}
      <UserActionTracker 
        trackLevelActions={true}
        trackArtifactActions={true}
        trackChatActions={true}
        actions={['profile_update', 'feedback_given', 'search']}
      />
    </MainLayout>
  );
} 