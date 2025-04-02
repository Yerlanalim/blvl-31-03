import React, { useMemo, memo } from 'react';
import { LevelWithStatus, LevelStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { LockClosedIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: LevelWithStatus;
  onClick: () => void;
}

/**
 * Represents a single level card in the level map
 * Optimized with memoization to prevent unnecessary re-renders
 */
const LevelCard = memo(({
  level,
  onClick,
}: LevelCardProps) => {
  const { title, order, status } = level;

  // Memoize the status color to avoid recalculating on every render
  const statusColor = useMemo(() => {
    switch (status) {
      case LevelStatus.Locked:
        return 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed';
      case LevelStatus.Available:
        return 'bg-white border-blue-400 text-blue-600 hover:bg-blue-50 cursor-pointer';
      case LevelStatus.Completed:
        return 'bg-green-50 border-green-400 text-green-600 hover:bg-green-100 cursor-pointer';
      default:
        return 'bg-white';
    }
  }, [status]);

  // Memoize the status icon to avoid recalculating on every render
  const statusIcon = useMemo(() => {
    switch (status) {
      case LevelStatus.Locked:
        return <LockClosedIcon className="h-4 w-4" />;
      case LevelStatus.Completed:
        return <CheckIcon className="h-4 w-4" />;
      case LevelStatus.Available:
        return <span className="text-xs font-bold">{order}</span>;
      default:
        return null;
    }
  }, [status, order]);

  // Memoize the icon background color
  const iconBackgroundColor = useMemo(() => {
    return status === LevelStatus.Locked ? 'bg-gray-300' : 
           status === LevelStatus.Completed ? 'bg-green-100' : 'bg-blue-100';
  }, [status]);

  // Memoize the status text
  const statusText = useMemo(() => {
    switch (status) {
      case LevelStatus.Locked:
        return 'Заблокирован';
      case LevelStatus.Available:
        return 'Доступен';
      case LevelStatus.Completed:
        return 'Пройден';
      default:
        return '';
    }
  }, [status]);

  return (
    <Card 
      className={cn(
        'border-2 transition-all duration-300 ease-in-out',
        status !== LevelStatus.Locked && 'hover:shadow-md',
        statusColor
      )}
      onClick={status !== LevelStatus.Locked ? onClick : undefined}
    >
      <CardContent className="p-4 flex items-center">
        <div 
          className={cn(
            'flex items-center justify-center rounded-full h-8 w-8 mr-3 transition-all duration-300',
            iconBackgroundColor
          )}
        >
          {statusIcon}
        </div>
        <div className="transition-all duration-200">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {statusText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

// Set display name for React DevTools
LevelCard.displayName = 'LevelCard';

export { LevelCard }; 