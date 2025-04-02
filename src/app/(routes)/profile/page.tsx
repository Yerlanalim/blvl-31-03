'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useSettings';
import { UserInfoCard } from '@/components/features/profile/UserInfoCard';
import { ProgressSummary } from '@/components/features/profile/ProgressSummary';
import { SkillsStatistics } from '@/components/features/profile/SkillsStatistics';

// Компонент для отображения профиля пользователя
export default function ProfilePage() {
  const { profile, isLoading, error } = useUserProfile();

  // Состояния загрузки и ошибки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-red-500">Ошибка</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Не удалось загрузить информацию о профиле: {(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Профиль пользователя</h1>
      
      {/* Блок с личной информацией */}
      <UserInfoCard profile={profile} />
      
      {/* Блок с прогрессом обучения */}
      <ProgressSummary />
      
      {/* Блок со статистикой навыков */}
      <SkillsStatistics />
    </div>
  );
} 