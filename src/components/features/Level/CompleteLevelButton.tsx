'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Level, UserProgress } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface CompleteLevelButtonProps {
  levelId: string;
  level: Level;
  userProgress: UserProgress | undefined;
  onCompleteLevel: (levelId: string, nextLevelId: string) => void;
  nextLevel: Level | null;
  isPending: boolean;
  canCompleteLevelCheck: (levelId: string, level: Level) => { 
    canComplete: boolean; 
    reason?: string 
  };
}

export const CompleteLevelButton: React.FC<CompleteLevelButtonProps> = ({
  levelId,
  level,
  userProgress,
  onCompleteLevel,
  nextLevel,
  isPending,
  canCompleteLevelCheck
}) => {
  // Проверяем возможность завершения уровня
  const completionStatus = canCompleteLevelCheck(levelId, level);
  
  // Обработчик клика на кнопку
  const handleClick = () => {
    if (!nextLevel || !completionStatus.canComplete) return;
    onCompleteLevel(levelId, nextLevel.id);
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
            Завершение уровня
            {completionStatus.canComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
          </h3>
          {!completionStatus.canComplete && completionStatus.reason && (
            <p className="text-red-600 dark:text-red-400 text-sm">{completionStatus.reason}</p>
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button 
                  onClick={handleClick}
                  disabled={!completionStatus.canComplete || isPending}
                  className="md:self-end w-full md:w-auto"
                >
                  {isPending ? "Завершение..." : "Завершить уровень"}
                </Button>
              </div>
            </TooltipTrigger>
            {!completionStatus.canComplete && completionStatus.reason && (
              <TooltipContent side="top">
                <p>{completionStatus.reason}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}; 