import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProgressSummaryProps {
  completed: number;
  total: number;
  percentage: number;
  isLoading: boolean;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  completed,
  total,
  percentage,
  isLoading,
}) => {
  return (
    <Card className="w-full transition-all duration-300 ease-in-out">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Ваш прогресс</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="space-y-2">
            <Progress value={percentage} className="h-2 w-full" />
            <p className="text-sm text-muted-foreground">
              Пройдено <span className="font-medium">{completed}</span> из{' '}
              <span className="font-medium">{total}</span> уровней (
              <span className="font-medium">{percentage}%</span>)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 