import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface DeleteArtifactDialogProps {
  artifactName: string;
  isOpen: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeleteArtifactDialog({
  artifactName,
  isOpen,
  isDeleting,
  onDelete,
  onCancel,
}: DeleteArtifactDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить артефакт</AlertDialogTitle>
          <AlertDialogDescription>
            Вы собираетесь удалить артефакт <strong>{artifactName}</strong>.
            <br />
            Это действие невозможно отменить. Все данные, включая файлы и статистику скачиваний, будут удалены навсегда.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Удаление...
              </>
            ) : (
              'Удалить'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 