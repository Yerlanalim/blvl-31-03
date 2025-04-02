'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Заглушка для данных навыков (будет реализовано в следующих задачах)
const mockSkills = [
  { name: 'Стратегическое мышление', progress: 65 },
  { name: 'Управление командой', progress: 45 },
  { name: 'Коммуникация', progress: 80 },
  { name: 'Финансовая грамотность', progress: 30 },
  { name: 'Маркетинг', progress: 50 },
  { name: 'Аналитика данных', progress: 25 },
];

type SkillsStatisticsProps = {
  // Подготовка для будущей интеграции с реальными данными
  // skills?: Skill[];
};

export function SkillsStatistics({}: SkillsStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика навыков</CardTitle>
        <CardDescription>Ваш прогресс по различным навыкам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSkills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span>{skill.name}</span>
                <span className="text-sm text-gray-500">{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 