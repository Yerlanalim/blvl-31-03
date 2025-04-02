'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginFormSchema, LoginFormValues } from '@/lib/zod-schemas';
import { useAuth } from '@/hooks/useAuth';
import { getRedirectFromUrl, getRedirectUrl, clearRedirectUrl } from '@/lib/utils/auth-redirect';

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

export function LoginForm() {
  const { login } = useAuth();
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      toast.success('Вы успешно вошли в систему');
      
      // Очищаем сохраненный URL редиректа
      clearRedirectUrl();
      
      // Редирект на сохраненный URL или на /map по умолчанию
      const targetPath = redirectPath || '/map';
      router.push(targetPath);
    } catch (error) {
      // Ошибка уже обрабатывается в useAuth, поэтому здесь ничего не делаем
      console.error('Ошибка входа:', error);
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
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm; 