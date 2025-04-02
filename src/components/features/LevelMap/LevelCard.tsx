import React from 'react';
import { LevelWithStatus, LevelStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { LockClosedIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: LevelWithStatus;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  onClick,
}) => {
  const { title, order, status } = level;

  const getStatusColor = (): string => {
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
  };

  const getStatusIcon = () => {
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
  };

  return (
    <Card 
      className={cn(
        'border-2 transition-all duration-300 ease-in-out',
        status !== LevelStatus.Locked && 'hover:shadow-md',
        getStatusColor()
      )}
      onClick={status !== LevelStatus.Locked ? onClick : undefined}
    >
      <CardContent className="p-4 flex items-center">
        <div 
          className={cn(
            'flex items-center justify-center rounded-full h-8 w-8 mr-3 transition-all duration-300',
            status === LevelStatus.Locked ? 'bg-gray-300' : 
            status === LevelStatus.Completed ? 'bg-green-100' : 'bg-blue-100'
          )}
        >
          {getStatusIcon()}
        </div>
        <div className="transition-all duration-200">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {status === LevelStatus.Locked && 'Заблокирован'}
            {status === LevelStatus.Available && 'Доступен'}
            {status === LevelStatus.Completed && 'Пройден'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 