# Задача 3.2: Улучшение обработки ошибок в приложении

## Описание

Текущая система обработки ошибок в приложении недостаточно надежна и информативна. Необходимо разработать комплексный подход к обработке ошибок, который обеспечит надежность приложения, информативные сообщения для пользователей и эффективный сбор информации для отладки. Задача включает создание единой системы обработки ошибок, улучшение пользовательского интерфейса для отображения ошибок и стандартизацию подходов к обработке исключений.

## Шаги выполнения

1. **Разработка централизованного сервиса обработки ошибок:**
   - Создать единый сервис для обработки всех типов ошибок
   - Определить типы и категории ошибок (сетевые, авторизация, валидация, бизнес-логика)
   - Разработать механизм логирования и отслеживания ошибок
   - Создать интерфейс для взаимодействия с системой мониторинга (Sentry)

2. **Улучшение визуального представления ошибок:**
   - Разработать компоненты для отображения ошибок различных типов
   - Создать пользовательские сообщения об ошибках в соответствии с их типом и контекстом
   - Внедрить анимации и интерактивные элементы для улучшения UX при ошибках
   - Разработать стратегию для различных устройств и размеров экрана

3. **Разработка стратегии обработки сетевых ошибок:**
   - Внедрить обработку проблем с подключением и таймаутов
   - Создать механизмы автоматического повтора запросов при временных проблемах
   - Разработать оффлайн-режим для критических функций
   - Реализовать информативные сообщения о статусе сети

4. **Улучшение обработки ошибок в формах и вводе данных:**
   - Внедрить валидацию на стороне клиента с информативными сообщениями
   - Реализовать визуальную обратную связь при ошибках ввода
   - Создать систему подсказок для исправления типичных ошибок пользователей
   - Оптимизировать UX при множественных ошибках в форме

5. **Разработка глобальных обработчиков исключений:**
   - Создать ErrorBoundary компоненты для изоляции ошибок
   - Внедрить обработку непредвиденных исключений на уровне приложения
   - Разработать стратегию восстановления после критических ошибок
   - Реализовать возможность автоматического сбора отчетов об ошибках от пользователей

## Пример централизованного сервиса обработки ошибок

```typescript
// src/lib/error/error-service.ts
import { ErrorMonitor } from '@/lib/monitoring/error-monitor';

// Типы ошибок
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  UNEXPECTED = 'unexpected',
}

// Интерфейс для расширенной информации об ошибке
export interface ErrorDetails {
  type: ErrorType;
  code?: string;
  message: string;
  userMessage?: string;
  technical?: string;
  data?: Record<string, any>;
  recoverable?: boolean;
  retryable?: boolean;
  suggestions?: string[];
}

// Класс для обработки ошибок в приложении
export class ErrorService {
  // Преобразование HTTP ошибок в понятные для приложения
  static handleHttpError(error: any): ErrorDetails {
    // Определение базовой информации
    const status = error.response?.status || 0;
    const errorData = error.response?.data;
    
    // Обработка по статус-кодам
    switch (status) {
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          code: 'AUTH_REQUIRED',
          message: 'Требуется авторизация',
          userMessage: 'Пожалуйста, войдите в систему для продолжения работы',
          recoverable: true,
          retryable: false,
        };
      
      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          code: 'ACCESS_DENIED',
          message: 'Доступ запрещен',
          userMessage: 'У вас нет доступа к этому ресурсу',
          recoverable: false,
          retryable: false,
        };
      
      case 404:
        return {
          type: ErrorType.NETWORK,
          code: 'NOT_FOUND',
          message: 'Ресурс не найден',
          userMessage: 'Запрашиваемый ресурс не найден на сервере',
          technical: `URL: ${error.config?.url || 'unknown'}`,
          recoverable: true,
          retryable: false,
        };
      
      case 422:
        return {
          type: ErrorType.VALIDATION,
          code: 'VALIDATION_ERROR',
          message: 'Ошибка валидации данных',
          userMessage: 'Пожалуйста, проверьте правильность введенных данных',
          data: errorData?.errors || {},
          recoverable: true,
          retryable: false,
          suggestions: [
            'Проверьте формат введенных данных',
            'Убедитесь, что все обязательные поля заполнены',
          ],
        };
      
      case 0:
        return {
          type: ErrorType.NETWORK,
          code: 'NETWORK_ERROR',
          message: 'Ошибка сети',
          userMessage: 'Не удалось подключиться к серверу. Проверьте ваше подключение к интернету',
          recoverable: true,
          retryable: true,
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.NETWORK,
          code: 'SERVER_ERROR',
          message: `Ошибка сервера (${status})`,
          userMessage: 'На сервере произошла ошибка. Мы уже работаем над её устранением',
          technical: `Status: ${status}, URL: ${error.config?.url || 'unknown'}`,
          recoverable: false,
          retryable: true,
        };
      
      default:
        return {
          type: ErrorType.UNEXPECTED,
          code: `HTTP_ERROR_${status}`,
          message: `Непредвиденная ошибка (${status})`,
          userMessage: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже',
          technical: `Status: ${status}, URL: ${error.config?.url || 'unknown'}`,
          recoverable: false,
          retryable: true,
        };
    }
  }
  
  // Обработка ошибок Firebase
  static handleFirebaseError(error: any): ErrorDetails {
    const code = error.code || 'unknown';
    
    // Сопоставление кодов ошибок Firebase
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return {
          type: ErrorType.AUTHENTICATION,
          code,
          message: 'Неверный email или пароль',
          userMessage: 'Неверный email или пароль. Пожалуйста, проверьте введенные данные',
          recoverable: true,
          retryable: false,
          suggestions: [
            'Проверьте правильность введенного email',
            'Возможно, вы забыли пароль? Воспользуйтесь восстановлением',
          ],
        };
      
      case 'auth/email-already-in-use':
        return {
          type: ErrorType.VALIDATION,
          code,
          message: 'Email уже используется',
          userMessage: 'Пользователь с таким email уже существует',
          recoverable: true,
          retryable: false,
          suggestions: [
            'Попробуйте войти в систему',
            'Воспользуйтесь восстановлением пароля',
          ],
        };
      
      case 'auth/popup-closed-by-user':
        return {
          type: ErrorType.AUTHENTICATION,
          code,
          message: 'Окно авторизации было закрыто',
          userMessage: 'Вы закрыли окно авторизации',
          recoverable: true,
          retryable: true,
        };
      
      case 'permission-denied':
        return {
          type: ErrorType.AUTHORIZATION,
          code,
          message: 'Нет доступа',
          userMessage: 'У вас нет прав для выполнения этого действия',
          recoverable: false,
          retryable: false,
        };
      
      default:
        return {
          type: ErrorType.UNEXPECTED,
          code,
          message: `Ошибка Firebase: ${error.message || code}`,
          userMessage: 'Произошла ошибка при обработке запроса',
          technical: `Firebase error: ${code}, message: ${error.message}`,
          recoverable: false,
          retryable: true,
        };
    }
  }
  
  // Обработка ошибки и отправка в систему мониторинга
  static handleError(error: any, context?: Record<string, any>): ErrorDetails {
    let errorDetails: ErrorDetails;
    
    // Определяем тип ошибки и преобразуем её
    if (error.isAxiosError) {
      errorDetails = this.handleHttpError(error);
    } else if (error.code && error.code.startsWith('auth/') || error.code === 'permission-denied') {
      errorDetails = this.handleFirebaseError(error);
    } else {
      // Общий случай для неизвестных ошибок
      errorDetails = {
        type: ErrorType.UNEXPECTED,
        message: error.message || 'Непредвиденная ошибка',
        userMessage: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже',
        technical: error.stack,
        recoverable: false,
        retryable: true,
      };
    }
    
    // Отправляем информацию в систему мониторинга
    ErrorMonitor.captureError(error, {
      source: context?.source || 'app',
      tags: {
        errorType: errorDetails.type,
        errorCode: errorDetails.code || 'unknown',
      },
      extra: {
        ...context,
        errorDetails,
      },
      level: errorDetails.type === ErrorType.UNEXPECTED ? 'error' : 'warning',
    });
    
    return errorDetails;
  }
}
```

## Пример компонента для отображения ошибок

```typescript
// src/components/common/ErrorDisplay.tsx
import { AlertCircle, RefreshCw, Info, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ErrorType } from '@/lib/error/error-service';

interface ErrorDisplayProps {
  errorType: ErrorType;
  title: string;
  description: string;
  suggestions?: string[];
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  errorType,
  title,
  description,
  suggestions,
  onRetry,
  onDismiss,
  className = '',
}: ErrorDisplayProps) {
  // Выбираем иконку в зависимости от типа ошибки
  const iconMap = {
    [ErrorType.NETWORK]: <RefreshCw className="h-5 w-5" />,
    [ErrorType.AUTHENTICATION]: <AlertCircle className="h-5 w-5" />,
    [ErrorType.AUTHORIZATION]: <XCircle className="h-5 w-5" />,
    [ErrorType.VALIDATION]: <Info className="h-5 w-5" />,
    [ErrorType.BUSINESS_LOGIC]: <AlertTriangle className="h-5 w-5" />,
    [ErrorType.UNEXPECTED]: <AlertCircle className="h-5 w-5" />,
  };
  
  // Выбираем вариант стиля в зависимости от типа ошибки
  const variantMap = {
    [ErrorType.NETWORK]: 'default',
    [ErrorType.AUTHENTICATION]: 'default',
    [ErrorType.AUTHORIZATION]: 'destructive',
    [ErrorType.VALIDATION]: 'default',
    [ErrorType.BUSINESS_LOGIC]: 'default',
    [ErrorType.UNEXPECTED]: 'destructive',
  };
  
  // Получаем иконку и вариант для текущего типа ошибки
  const icon = iconMap[errorType] || iconMap[ErrorType.UNEXPECTED];
  const variant = variantMap[errorType] || 'default';
  
  return (
    <Alert variant={variant} className={`${className} mb-4`}>
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{icon}</div>
        <div className="flex-1">
          <AlertTitle className="mb-1">{title}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{description}</p>
            
            {/* Отображаем список подсказок, если они есть */}
            {suggestions && suggestions.length > 0 && (
              <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
            
            {/* Отображаем кнопки действий */}
            <div className="mt-3 flex space-x-2">
              {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Повторить
                </Button>
              )}
              
              {onDismiss && (
                <Button size="sm" variant="ghost" onClick={onDismiss}>
                  Закрыть
                </Button>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
```

## Пример хука для обработки ошибок формы

```typescript
// src/hooks/useFormError.tsx
import { useState, useCallback } from 'react';
import { ErrorType, ErrorDetails, ErrorService } from '@/lib/error/error-service';

interface UseFormErrorProps {
  // Название формы для лучшей идентификации в логах
  formName: string;
  // Обработчик для особых случаев ошибок (например, перенаправление при ошибках аутентификации)
  onSpecialCases?: (error: ErrorDetails) => boolean;
}

interface FormErrorState {
  error: ErrorDetails | null;
  fieldErrors: Record<string, string>;
}

export function useFormError({ formName, onSpecialCases }: UseFormErrorProps) {
  // Состояние для хранения ошибок формы
  const [formError, setFormError] = useState<FormErrorState>({
    error: null,
    fieldErrors: {},
  });
  
  // Обработка ошибки при отправке формы
  const handleError = useCallback((error: any) => {
    // Обрабатываем ошибку через централизованный сервис
    const errorDetails = ErrorService.handleError(error, {
      source: `form:${formName}`,
      formData: error.formData,
    });
    
    // Проверяем на особые случаи, требующие специальной обработки
    if (onSpecialCases && onSpecialCases(errorDetails)) {
      return;
    }
    
    // Обрабатываем ошибки валидации полей
    if (errorDetails.type === ErrorType.VALIDATION && errorDetails.data) {
      setFormError({
        error: errorDetails,
        fieldErrors: errorDetails.data,
      });
    } else {
      // Общая ошибка формы
      setFormError({
        error: errorDetails,
        fieldErrors: {},
      });
    }
  }, [formName, onSpecialCases]);
  
  // Сброс ошибок
  const resetErrors = useCallback(() => {
    setFormError({
      error: null,
      fieldErrors: {},
    });
  }, []);
  
  // Получение ошибки для конкретного поля
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return formError.fieldErrors[fieldName];
  }, [formError.fieldErrors]);
  
  return {
    formError: formError.error,
    fieldErrors: formError.fieldErrors,
    getFieldError,
    handleError,
    resetErrors,
  };
}
```

## Пример компонента FormField с обработкой ошибок

```typescript
// src/components/common/FormField.tsx
import { useState } from 'react';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  autoComplete?: string;
}

export function FormField({
  id,
  label,
  error,
  description,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  onBlur,
  className,
  autoComplete,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <FormItem className={className}>
      <FormLabel htmlFor={id} className={cn(required && 'after:content-["*"] after:ml-0.5 after:text-red-500')}>
        {label}
      </FormLabel>
      <FormControl>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          className={cn(error && 'border-red-500 focus-visible:ring-red-500')}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
          autoComplete={autoComplete}
        />
      </FormControl>
      {description && !error && (
        <FormDescription id={`${id}-description`}>{description}</FormDescription>
      )}
      {error && (
        <FormMessage id={`${id}-error`} className="text-red-500">
          {error}
        </FormMessage>
      )}
    </FormItem>
  );
}
```

## Пример обработки сетевых ошибок

```typescript
// src/lib/api/api-client.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { ErrorService } from '@/lib/error/error-service';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  },
});

// Параметры повторной отправки запроса
interface RetryConfig {
  retries: number;
  retryDelay: number;
}

// Функция для отправки запроса с автоматическим повтором
export async function request<T>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig = { retries: 3, retryDelay: 1000 }
): Promise<T> {
  let retries = retryConfig.retries;
  
  while (true) {
    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      // Уменьшаем счетчик попыток
      retries--;
      
      // Проверяем, можно ли повторить запрос
      const axiosError = error as AxiosError;
      const isNetworkError = !axiosError.response || axiosError.code === 'ECONNABORTED';
      const isServerError = axiosError.response?.status && axiosError.response.status >= 500;
      const isRetryable = isNetworkError || isServerError;
      
      // Если нельзя повторить или закончились попытки
      if (!isRetryable || retries <= 0) {
        // Преобразуем ошибку в понятный формат и выбрасываем
        const errorDetails = ErrorService.handleHttpError(error);
        throw new Error(errorDetails.message, { cause: error });
      }
      
      // Ждем перед повторной попыткой (с экспоненциальным увеличением)
      const delay = retryConfig.retryDelay * (2 ** (retryConfig.retries - retries));
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Логируем повторную попытку
      console.warn(`Retrying request to ${config.url}. Attempts remaining: ${retries}`);
    }
  }
}

export default apiClient;
```

## Рекомендации

1. **Делайте ошибки понятными** - используйте язык, понятный пользователю, а не технические термины
2. **Предлагайте решения** - не просто сообщайте об ошибке, но и подсказывайте, как её исправить
3. **Используйте визуальные индикаторы** - выделяйте ошибки цветом, иконками и стилями для быстрого распознавания
4. **Централизуйте обработку ошибок** - используйте единый сервис для всех типов ошибок
5. **Разграничивайте типы ошибок** - обрабатывайте по-разному ошибки валидации, сетевые ошибки и ошибки бизнес-логики
6. **Не теряйте контекст** - сохраняйте и передавайте информацию о том, где и при каких обстоятельствах произошла ошибка
7. **Думайте о восстановлении** - предусматривайте механизмы автоматического восстановления после временных сбоев

## Ожидаемый результат

- Единый сервис обработки ошибок, интегрированный со всеми частями приложения
- Улучшенные компоненты для отображения ошибок с информативными сообщениями
- Стандартизированный подход к обработке сетевых ошибок с автоматическими повторами
- Интуитивно понятная система валидации форм и обратной связи
- Улучшенный пользовательский опыт при возникновении ошибок
- Повышенная надежность приложения за счет корректной обработки исключительных ситуаций

## Ресурсы

- [Error Handling в React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Axios Error Handling](https://axios-http.com/docs/handling_errors)
- [Designing Error States](https://www.nngroup.com/articles/error-message-guidelines/)
- [Form Validation UX](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 