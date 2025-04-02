import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Регистрация | BizLevel',
  description: 'Зарегистрируйтесь на платформе BizLevel для доступа к обучающим материалам по бизнесу',
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Регистрация в BizLevel</h1>
        <p className="text-gray-600 mt-2">
          Создайте аккаунт для доступа к обучающим материалам
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="mt-4 text-center">
        <p className="text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Войти
          </Link>
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Преимущества регистрации</h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>Доступ к 10 уровням бизнес-обучения с постепенной разблокировкой</li>
          <li>Короткие видео (2-4 минуты) для эффективного обучения</li>
          <li>Практические шаблоны и чек-листы для скачивания</li>
          <li>Тесты для закрепления знаний</li>
          <li>Отслеживание прогресса и получение достижений</li>
        </ul>
      </div>
    </div>
  );
} 