'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLevelsWithStatus } from '@/hooks/useLevels';
import { useProgress } from '@/hooks/useProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelStatus } from '@/types';
import { LevelMap, ProgressSummary } from '@/components/features/LevelMap';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function MapPage() {
  const router = useRouter();
  const { levelsWithStatus, isLoading: isLevelsLoading, error } = useLevelsWithStatus();
  const { progress, isLoading: isProgressLoading } = useProgress();

  const isLoading = isLevelsLoading || isProgressLoading;

  // Расчет прогресса
  const calculateProgress = useCallback(() => {
    if (!levelsWithStatus || !progress) return { completed: 0, total: 0, percentage: 0 };

    const completedLevels = levelsWithStatus.filter(
      (level) => level.status === LevelStatus.Completed
    ).length;
    const totalLevels = levelsWithStatus.length;
    const percentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

    return { completed: completedLevels, total: totalLevels, percentage };
  }, [levelsWithStatus, progress]);

  const { completed, total, percentage } = calculateProgress();

  // Обработчик клика по уровню с проверкой статуса
  const handleLevelClick = useCallback((levelId: string) => {
    if (!levelsWithStatus) return;
    
    const level = levelsWithStatus.find(l => l.id === levelId);
    
    if (!level) {
      toast.error('Уровень не найден');
      return;
    }
    
    if (level.status === LevelStatus.Locked) {
      toast("Уровень заблокирован", {
        description: "Необходимо пройти предыдущие уровни, чтобы разблокировать этот уровень.",
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        duration: 3000,
      });
      return;
    }
    
    // Если уровень доступен или пройден, перенаправляем на его страницу
    router.push(`/level/${levelId}`);
  }, [levelsWithStatus, router]);

  // Обработка ошибок загрузки
  React.useEffect(() => {
    if (error) {
      toast.error('Ошибка при загрузке данных', {
        description: 'Не удалось загрузить уровни. Пожалуйста, попробуйте обновить страницу.',
        duration: 5000,
      });
    }
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col gap-8">
        {/* Заголовок страницы */}
        <div className="transition-transform duration-300 ease-in-out hover:translate-x-1">
          <h1 className="text-3xl font-bold">Карта уровней</h1>
          <p className="text-muted-foreground mt-2">
            Ваше путешествие в мир бизнес-знаний
          </p>
        </div>

        {/* Компонент общего прогресса */}
        <ProgressSummary 
          completed={completed}
          total={total}
          percentage={percentage}
          isLoading={isLoading}
        />

        {/* Карта уровней */}
        <Card className="transition-all duration-300 ease-in-out">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Уровни обучения</CardTitle>
          </CardHeader>
          <CardContent>
            <LevelMap 
              levels={levelsWithStatus || []}
              isLoading={isLoading}
              onLevelClick={handleLevelClick}
            />
          </CardContent>
        </Card>

        {/* Информация о текущем уровне */}
        {!isLoading && progress && (
          <Card className="transition-all duration-300 ease-in-out hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Текущий уровень</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>ID текущего уровня: <span className="font-medium">{progress.currentLevelId}</span></p>
                <p className="mt-2">
                  Завершите текущий уровень, чтобы разблокировать следующий.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 