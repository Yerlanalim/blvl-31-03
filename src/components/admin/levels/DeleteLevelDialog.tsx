'use client';

import { Level } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteLevel } from '@/hooks/useAdminLevels';
import { Loader2 } from 'lucide-react';

interface DeleteLevelDialogProps {
  level: Level;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteLevelDialog = ({ level, open, onOpenChange }: DeleteLevelDialogProps) => {
  const { mutate: deleteLevel, isPending } = useDeleteLevel();

  const handleDelete = () => {
    deleteLevel(level.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие навсегда удалит уровень <strong>{level.title}</strong> из системы.
            <br /><br />
            <span className="text-destructive font-medium">
              Внимание:
            </span>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Все пользователи, которые сейчас на этом уровне, потеряют свой прогресс</li>
              <li>Видео и тесты этого уровня будут удалены</li>
              <li>Это действие необратимо</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Удалить
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLevelDialog; 