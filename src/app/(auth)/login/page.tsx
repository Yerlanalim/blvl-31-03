import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Вход | BizLevel',
  description: 'Войдите в систему, чтобы продолжить обучение бизнес-навыкам на BizLevel',
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Вход в BizLevel</h1>
        <p className="text-gray-600 mt-2">
          Войдите, чтобы продолжить обучение
        </p>
      </div>
      
      <LoginForm />
      
      <div className="mt-4 text-center space-y-3">
        <p className="text-sm">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </p>
        <p className="text-sm">
          <Link href="/reset-password" className="text-primary hover:underline font-medium">
            Забыли пароль?
          </Link>
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">О платформе</h3>
        <p className="text-sm text-gray-600">
          BizLevel — это платформа для предпринимателей и руководителей, 
          которая помогает повысить бизнес-навыки через короткие видео, 
          тесты и практические артефакты.
        </p>
      </div>
    </div>
  );
} 