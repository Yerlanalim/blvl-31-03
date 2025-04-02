'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

import { registerFormSchema, RegisterFormValues } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';
import { getRedirectUrl, clearRedirectUrl } from '@/lib/utils/auth-redirect';

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

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Получаем URL редиректа при монтировании компонента
  useEffect(() => {
    // Сначала проверяем URL параметры
    const redirectFromUrl = searchParams.get('redirect');
    if (redirectFromUrl) {
      setRedirectPath(decodeURIComponent(redirectFromUrl));
      return;
    }

    // Если в URL нет параметра, проверяем localStorage
    const savedRedirect = getRedirectUrl();
    if (savedRedirect) {
      setRedirectPath(savedRedirect);
    }
  }, [searchParams]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Третий параметр (displayName) временно используем email, 
      // в будущем можно добавить отдельное поле для имени пользователя
      await register(values.email, values.password, values.email.split('@')[0]);
      toast.success('Регистрация прошла успешно!');
      
      // Очищаем сохраненный URL редиректа
      clearRedirectUrl();
      
      // Редирект на сохраненный URL или на /map по умолчанию
      const targetPath = redirectPath || '/map';
      router.push(targetPath);
    } catch (error) {
      // Ошибка уже обрабатывается в useAuth, поэтому здесь ничего не делаем
      console.error('Ошибка регистрации:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтверждение пароля</FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm; 