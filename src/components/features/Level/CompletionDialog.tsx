'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Level } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trophy, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedLevel: Level;
  nextLevel: Level | null;
}

export const CompletionDialog: React.FC<CompletionDialogProps> = ({
  open,
  onOpenChange,
  completedLevel,
  nextLevel,
}) => {
  const router = useRouter();

  // Функция перехода на карту уровней
  const handleBackToMap = () => {
    onOpenChange(false);
    router.push('/map');
  };

  // Функция перехода к следующему уровню
  const handleGoToNextLevel = () => {
    if (!nextLevel) return;
    onOpenChange(false);
    router.push(`/level/${nextLevel.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Поздравляем!</DialogTitle>
          <DialogDescription className="text-center">
            Вы успешно завершили уровень<br />
            <span className="font-semibold text-foreground">{completedLevel.title}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {nextLevel ? (
            <div className="bg-secondary/30 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Разблокирован новый уровень:
              </h4>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold"
                )}>
                  {nextLevel.order}
                </div>
                <div>
                  <p className="font-medium">{nextLevel.title}</p>
                  <p className="text-sm text-muted-foreground">{nextLevel.description.substring(0, 60)}...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-1 text-center">
                Вы прошли все доступные уровни!
              </h4>
              <p className="text-sm text-center text-muted-foreground">
                Поздравляем с успешным завершением курса.
              </p>
            </div>
          )}
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                ВАШЕ ДОСТИЖЕНИЕ
              </span>
            </div>
          </div>
          
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-medium text-sm">Уровень завершен</p>
              <p className="text-xs text-muted-foreground">
                +{completedLevel.order * 100} очков опыта
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleBackToMap}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Карта уровней
          </Button>
          
          {nextLevel && (
            <Button
              className="flex-1"
              onClick={handleGoToNextLevel}
            >
              Следующий уровень
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 