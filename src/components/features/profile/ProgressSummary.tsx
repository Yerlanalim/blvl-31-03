'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Заглушка для данных прогресса (будет реализовано в следующих задачах)
const mockProgress = {
  completedLevels: 3,
  totalLevels: 10,
  levels: [
    { id: 1, name: 'Уровень 1', description: 'Основы бизнеса', status: 'completed' },
    { id: 2, name: 'Уровень 2', description: 'Стратегия и планирование', status: 'completed' },
    { id: 3, name: 'Уровень 3', description: 'Маркетинг и продажи', status: 'completed' },
    { id: 4, name: 'Уровень 4', description: 'Финансы', status: 'in-progress' },
  ]
};

type ProgressSummaryProps = {
  // Подготовка для будущей интеграции с реальными данными
  // progress?: UserProgress;
};

export function ProgressSummary({}: ProgressSummaryProps) {
  // Вычисляем процент прогресса
  const progressPercentage = (mockProgress.completedLevels / mockProgress.totalLevels) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогресс обучения</CardTitle>
        <CardDescription>Ваш прогресс прохождения уровней</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Пройдено уровней: {mockProgress.completedLevels} из {mockProgress.totalLevels}</span>
            <span className="text-sm text-gray-500">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Уровни прогресса (заглушки, функциональность будет добавлена позже)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProgress.levels.map((level) => (
              <Card key={level.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{level.name}</p>
                    <p className="text-sm text-gray-500">{level.description}</p>
                  </div>
                  <div className={`rounded-full ${
                    level.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  } px-2 py-1 text-xs font-medium`}>
                    {level.status === 'completed' ? 'Пройден' : 'В процессе'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 