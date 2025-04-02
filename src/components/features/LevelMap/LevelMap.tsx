'use client';

import React from 'react';
import { LevelWithStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { LevelCard } from './LevelCard';
import { cn } from '@/lib/utils';

interface LevelMapProps {
  levels: LevelWithStatus[];
  isLoading: boolean;
  onLevelClick: (levelId: string) => void;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  levels,
  isLoading,
  onLevelClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative py-4">
      {/* Вертикальная линия соединяющая уровни */}
      <div className="absolute left-[40px] top-12 bottom-4 w-1 bg-gray-200 z-0 hidden md:block" />
      
      {/* Сетка уровней */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 relative z-10">
        {levels.map((level, index) => (
          <div 
            key={level.id} 
            className={cn(
              "relative transition-all duration-300 ease-in-out", 
              "hover:translate-x-1 md:hover:translate-x-2"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Карточка уровня */}
            <LevelCard
              level={level}
              onClick={() => onLevelClick(level.id)}
            />
            
            {/* Горизонтальная соединительная линия (для мобильных устройств) */}
            {index < levels.length - 1 && (
              <div className="absolute h-6 w-1 bg-gray-200 left-[40px] -bottom-6 md:hidden" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 