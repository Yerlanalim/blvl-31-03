'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getRedirectUrl, clearRedirectUrl } from '@/lib/utils/auth-redirect';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Если пользователь аутентифицирован, перенаправляем на сохраненный URL или /map
  useEffect(() => {
    if (user && !loading) {
      // Проверяем наличие сохраненного URL для редиректа
      const redirectUrl = getRedirectUrl();
      
      // Очищаем сохраненный URL редиректа
      clearRedirectUrl();
      
      // Редирект на сохраненный URL или /map по умолчанию
      router.push(redirectUrl || '/map');
    }
  }, [user, loading, router]);

  // Показываем индикатор загрузки, пока проверяется состояние аутентификации
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Если пользователь не аутентифицирован, показываем страницу аутентификации
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="mb-8 text-center">
        <Link href="/" className="text-3xl font-bold text-primary">
          BizLevel
        </Link>
        <p className="mt-2 text-gray-600">Платформа для повышения бизнес-навыков</p>
      </div>
      
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        {children}
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} BizLevel. Все права защищены.
      </div>
    </div>
  );
} 