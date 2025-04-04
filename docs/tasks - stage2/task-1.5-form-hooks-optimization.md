# Задача 1.5: Оптимизация хуков форм и устранение дублирования

## Описание

В приложении существует дублирование кода в компонентах форм и связанных с ними хуков. Это затрудняет поддержку, увеличивает размер кодовой базы и создает потенциальные источники ошибок. Необходимо создать абстракцию для работы с формами, которая унифицирует обработку валидации, отправки данных и отображения ошибок, используя React Hook Form и Zod.

## Шаги выполнения

1. **Анализ текущих форм и выявление общих паттернов:**
   - Проанализировать существующие формы (`LoginForm`, `RegisterForm`, `ProfileSettingsForm` и др.)
   - Выявить общие паттерны валидации, обработки ошибок и состояний загрузки
   - Определить структуру для универсального хука формы

2. **Создание базовых типов для работы с формами:**
   - Создать директорию `src/hooks/form`
   - Определить базовые типы для обработки состояний формы, ошибок и действий

3. **Разработка универсального хука для форм:**
   - Создать хук `useFormWithZod` для унификации работы с React Hook Form и Zod
   - Реализовать обработку состояний загрузки, успеха и ошибок
   - Обеспечить типобезопасность с использованием дженериков

4. **Создание хуков для конкретных типов форм:**
   - Разработать специализированные хуки (например, `useAuthForm`, `useProfileForm`)
   - Использовать базовый хук `useFormWithZod` с конкретными схемами валидации
   - Реализовать специфичную логику для каждого типа формы

5. **Рефакторинг компонентов форм:**
   - Переписать компоненты форм с использованием новых хуков
   - Удалить дублирующийся код
   - Обеспечить единообразный UX для всех форм

## Пример базового хука формы

```typescript
// src/hooks/form/useFormWithZod.ts
import { useState } from 'react';
import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface UseFormWithZodOptions<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
}

export function useFormWithZod<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  onError,
  successMessage
}: UseFormWithZodOptions<T>) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur'
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      setStatus('submitting');
      setError(null);
      
      await onSubmit(data);
      
      setStatus('success');
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
      
      toast.error(errorMessage);
      
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  };

  return {
    form,
    status,
    error,
    isSubmitting: status === 'submitting',
    isSuccess: status === 'success',
    isError: status === 'error',
    handleSubmit: form.handleSubmit(handleSubmit)
  };
}
```

## Пример специализированного хука для формы аутентификации

```typescript
// src/hooks/form/useAuthForm.ts
import { z } from 'zod';
import { useFormWithZod } from './useFormWithZod';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Схема для формы входа
export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов')
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  return useFormWithZod<LoginFormValues>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async (data) => {
      await login(data.email, data.password);
    },
    onSuccess: () => {
      router.push('/map');
    },
    successMessage: 'Вход выполнен успешно'
  });
}

// Схема для формы регистрации
export const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const { register } = useAuth();
  const router = useRouter();

  return useFormWithZod<RegisterFormValues>({
    schema: registerSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async (data) => {
      await register(data.email, data.password);
    },
    onSuccess: () => {
      router.push('/map');
    },
    successMessage: 'Регистрация выполнена успешно'
  });
}
```

## Пример использования в компоненте формы

```tsx
// src/components/auth/LoginForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { useLoginForm } from '@/hooks/form/useAuthForm';

export function LoginForm() {
  const { form, isSubmitting, handleSubmit } = useLoginForm();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...field}
              error={fieldState.error?.message}
            />
            {fieldState.error?.message && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">Пароль</label>
            <Input
              id="password"
              type="password"
              placeholder="******"
              {...field}
              error={fieldState.error?.message}
            />
            {fieldState.error?.message && (
              <p className="text-sm text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
        aria-disabled={isSubmitting ? "true" : "false"}
      >
        {isSubmitting ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}
```

## Рекомендации

1. Создавайте небольшие, узкоспециализированные хуки с единственной ответственностью
2. Используйте композицию хуков для реализации сложной логики
3. Не дублируйте схемы валидации, храните их в центральном месте
4. Обеспечивайте типобезопасность с использованием дженериков и Zod
5. Стандартизируйте обработку ошибок и сообщений об успехе

## Ожидаемый результат

- Базовый хук `useFormWithZod` для унификации работы с формами
- Набор специализированных хуков для различных типов форм
- Рефакторинг компонентов форм с использованием новых хуков
- Удаление дублирующегося кода
- Улучшенный UX форм с единообразной обработкой ошибок и состояний

## Ресурсы

- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Custom React Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 