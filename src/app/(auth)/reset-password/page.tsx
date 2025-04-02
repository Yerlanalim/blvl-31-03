import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Сброс пароля | BizLevel',
  description: 'Восстановите доступ к вашему аккаунту BizLevel',
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Сброс пароля</h1>
        <p className="text-gray-600 mt-2">
          Восстановите доступ к вашему аккаунту
        </p>
      </div>
      
      <ResetPasswordForm />
      
      <div className="mt-4 text-center">
        <p className="text-sm">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Вернуться к странице входа
          </Link>
        </p>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Инструкции по сбросу пароля</h3>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
          <li>Введите email, указанный при регистрации</li>
          <li>Нажмите кнопку "Отправить инструкции"</li>
          <li>Проверьте вашу электронную почту (включая папку Спам)</li>
          <li>Перейдите по ссылке из письма</li>
          <li>Создайте новый пароль на открывшейся странице</li>
        </ol>
        <p className="text-sm text-gray-600 mt-4">
          Если вы не получили письмо в течение нескольких минут, проверьте, правильно ли указан email, 
          и попробуйте отправить запрос повторно.
        </p>
      </div>
    </div>
  );
} 