'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { resetPasswordFormSchema, ResetPasswordFormValues } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircleIcon } from 'lucide-react';

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      setIsSuccessful(true);
      toast.success('Инструкции по сбросу пароля отправлены на ваш email');
    } catch (error) {
      // Ошибка уже обрабатывается в useAuth, поэтому здесь ничего не делаем
      console.error('Ошибка сброса пароля:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccessful) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
        <AlertDescription className="mt-3 text-green-800">
          <div className="text-center">
            <h3 className="text-lg font-medium">Проверьте свою почту</h3>
            <p className="mt-2">
              Мы отправили инструкции по сбросу пароля на указанный адрес электронной почты. 
              Пожалуйста, проверьте свою почту (включая папку "Спам").
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setIsSuccessful(false);
                form.reset();
              }}
            >
              Отправить снова
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@mail.ru"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить инструкции'}
        </Button>
      </form>
    </Form>
  );
}

export default ResetPasswordForm; 