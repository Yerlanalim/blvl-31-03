'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountSettingsFormValues, accountSettingsSchema } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AccountSettingsForm() {
  const { user, resetPassword } = useAuth();
  const router = useRouter();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });
  
  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    try {
      setIsSubmitting(true);
      await resetPassword(user.email);
      setResetEmailSent(true);
      toast.success('Письмо для сброса пароля отправлено');
    } catch (error) {
      toast.error(`Ошибка: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSubmit = async (data: AccountSettingsFormValues) => {
    // Обновление email не поддерживается напрямую без повторной аутентификации
    toast.info('Изменение email требует повторной аутентификации. Для безопасности используйте сброс пароля и изменение email после входа заново.');
  };
  
  if (!user) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить данные пользователя. Пожалуйста, войдите в систему снова.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>
                  Ваш email используется для входа в систему и получения уведомлений.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Смена пароля</h3>
          <p className="text-sm text-muted-foreground">
            Для сброса пароля мы отправим вам письмо с инструкциями.
          </p>
        </div>
        
        {resetEmailSent ? (
          <Alert>
            <AlertTitle>Письмо отправлено</AlertTitle>
            <AlertDescription>
              Письмо для сброса пароля было отправлено на ваш email. Проверьте ваш почтовый ящик.
            </AlertDescription>
          </Alert>
        ) : (
          <Button
            variant="outline"
            onClick={handleResetPassword}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить письмо для сброса пароля'}
          </Button>
        )}
      </div>
    </div>
  );
} 