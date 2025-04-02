'use client';

import { useState } from 'react';
import { User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useUpdateUserRole } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';

interface UserRoleDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserRoleDialog = ({ user, open, onOpenChange }: UserRoleDialogProps) => {
  const [role, setRole] = useState<'user' | 'admin'>(user.role as 'user' | 'admin' || 'user');
  const { mutate: updateUserRole, isPending } = useUpdateUserRole();

  const handleSubmit = () => {
    updateUserRole(
      { userId: user.id, role },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить роль пользователя</DialogTitle>
          <DialogDescription>
            Изменение роли пользователя {user.displayName || user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={role}
            onValueChange={(value) => setRole(value as 'user' | 'admin')}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user-role" />
              <Label htmlFor="user-role">Пользователь</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin-role" />
              <Label htmlFor="admin-role">Администратор</Label>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleDialog; 