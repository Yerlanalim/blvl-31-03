import React from 'react';
import { LevelWithStatus, LevelStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { LockClosedIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

// Types for the status configurations
interface StatusConfig {
  color: string;
  icon: React.ReactNode;
  text: string;
  iconBg: string;
}

// Map of status configurations to avoid repeated logic
const STATUS_CONFIG: Record<LevelStatus, StatusConfig> = {
  [LevelStatus.Locked]: {
    color: 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed',
    icon: <LockClosedIcon className="h-4 w-4" />,
    text: 'Заблокирован',
    iconBg: 'bg-gray-300'
  },
  [LevelStatus.Available]: {
    color: 'bg-white border-blue-400 text-blue-600 hover:bg-blue-50 cursor-pointer',
    icon: null, // Will use the level order instead
    text: 'Доступен',
    iconBg: 'bg-blue-100'
  },
  [LevelStatus.Completed]: {
    color: 'bg-green-50 border-green-400 text-green-600 hover:bg-green-100 cursor-pointer',
    icon: <CheckIcon className="h-4 w-4" />,
    text: 'Пройден',
    iconBg: 'bg-green-100'
  }
};

interface LevelCardProps {
  level: LevelWithStatus;
  onClick: () => void;
}

/**
 * Represents a single level card in the level map
 */
export const LevelCard = React.memo<LevelCardProps>(({ level, onClick }) => {
  const { title, order, status } = level;
  const config = STATUS_CONFIG[status];
  
  // For available levels, the icon is the order number
  const statusIcon = status === LevelStatus.Available 
    ? <span className="text-xs font-bold">{order}</span> 
    : config.icon;
  
  return (
    <Card 
      className={cn(
        'card border-2 transition-all duration-300 ease-in-out',
        status !== LevelStatus.Locked && 'hover:shadow-md',
        config.color
      )}
      onClick={status !== LevelStatus.Locked ? onClick : undefined}
      data-testid={`level-card-${level.id}`}
    >
      <CardContent className="p-4 flex items-center">
        <div 
          className={cn(
            'flex items-center justify-center rounded-full h-8 w-8 mr-3 transition-all duration-300',
            config.iconBg
          )}
        >
          {statusIcon}
        </div>
        <div className="transition-all duration-200">
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {config.text}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

// Set display name for React DevTools
LevelCard.displayName = 'LevelCard'; 