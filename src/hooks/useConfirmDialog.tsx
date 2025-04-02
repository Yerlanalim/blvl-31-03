'use client';

import { useState } from 'react';
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

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps>({
    title: '',
    description: '',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    onConfirm: () => {},
  });

  const showConfirmDialog = (props: ConfirmDialogProps) => {
    setDialogProps(props);
    setOpen(true);
  };

  const handleConfirm = () => {
    dialogProps.onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (dialogProps.onCancel) {
      dialogProps.onCancel();
    }
    setOpen(false);
  };

  const ConfirmDialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogProps.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialogProps.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {dialogProps.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {dialogProps.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { ConfirmDialog, showConfirmDialog };
}

export default useConfirmDialog; 